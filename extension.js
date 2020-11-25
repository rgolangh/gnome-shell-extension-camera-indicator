'use strict';

const Main = imports.ui.main;
const Config = imports.misc.config;
const ExtensionUtils = imports.misc.extensionUtils;
const Me = ExtensionUtils.getCurrentExtension();
const Util = imports.misc.util;
const St = imports.gi.St;
const Gio = imports.gi.Gio;
const GLib = imports.gi.GLib;
const Lang = imports.lang;
const PanelMenu = imports.ui.panelMenu;
const PopupMenu = imports.ui.popupMenu;
const GObject = imports.gi.GObject;

const NA = _('n/a');

let dbusService = null;
let dbusInst = null;
let dbusId = null;
let debugEnabled = true;
let menu;

function debug(msg) {
    if (debugEnabled) {
        log(`gnome-shell-extensions-camera-indicator - [DEBUG] ${msg}`);
    }
}

function info(msg) {
    if (debugEnabled) {
        log(`gnome-shell-extensions-camera-indicator - [INFO] ${msg}`);
    }
}

function enable() {
    info('enabling camera-indeicator-extension');
    dbusService = new Bus();
    menu = new camMenu();
    debug(menu);
    menu.renderMenu(false);
    Main.panel.addToStatusArea('camera-indicator-menu', menu);
}

function disable() {
    info("disabling extension");
    dbusService.disconnect()
    menu.destroy();
}

function createIcon(name, styleClass) {
    return new St.Icon({ icon_name: name, style_class: styleClass, icon_size: '14' });
}

var camMenu = GObject.registerClass(
    {
        GTypeName: 'camMenu'
    },
class CamMenu extends PanelMenu.Button {
    _init() {
        super._init(0.0, "camera-inidicator");
        this.menu.box.add_style_class_name('camera-indicator-menu');
        this.hbox = new St.BoxLayout({ style_class: 'panel-status-menu-box' });

        this.icon = new St.Icon({
                icon_name: 'media-record-symbolic',
        });

        this.hbox.add_child(this.icon);
        this.hbox.add_child(PopupMenu.arrowIcon(St.Side.BOTTOM));
        this.add_child(this.hbox);
        this.connect('button_press_event', Lang.bind(this, () => {
            if (this.menu.isOpen) {
                this.menu.removeAll();
                this.renderMenu();
            }
        }));
        
    }

    renderMenu(toggleOn) {
        if (toggleOn) {
            this.icon.style_class="camera-on";
        } else {
            this.icon.style_class="camera-off";
        }
        try {
            this.menu.addMenuItem(new PopupMenu.PopupMenuItem(`basic menu - camera is use ${toggleOn}`)); 
            this.show();
            return;
        } catch (err) {
            const errMsg = _("Error occurred rendering camera indicator menu");
            this.menu.addMenuItem(new PopupMenu.PopupMenuItem(errMsg)); 
            info(`${errMsg}: ${err} - ${err.stack}`);
        }
        this.show();
    }
});

const BusInterface = '<node> \
<interface name="org.cam.Bus"> \
<method name="deviceEvent"> \
    <arg type="s" direction="in" /> \
    <arg type="b" direction="in" /> \
</method> \
</interface> \
</node>';
const BusServiceInfo = Gio.DBusInterfaceInfo.new_for_xml(BusInterface);

var Bus = GObject.registerClass(
class Bus extends GObject.Object {
    _init(params) {
        try {
            info('init and export bus interface');
            this._dbusImpl = Gio.DBusExportedObject.wrapJSObject (BusInterface, this);
            this._dbusImpl.export(Gio.DBus.session, '/org/cam/Bus');
        } catch (err) {
            info(`"failed to export dbus function ${err}`);
        }
    }
    

    // toggle using gdbus call --session --dest org.gnome.Shell --object-path /org/cam/Bus --method org.cam.Bus.deviceEvent 'some text' false
    deviceEvent(devicePath, action) {
        info(`device event - devicePath: ${devicePath} action: ${action}`);
        menu.renderMenu(action);
    }

    disconnect() {
        info('calling disconnect to unexport dbus');
        this._dbusImpl.unexport();
    }
});

