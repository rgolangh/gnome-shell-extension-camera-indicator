**Camera Indicator** is a gnome-shell extension that indicates when a camera or video devices is in use 

This project is mostly exploratory to learn more about eBPF and DBUS but comes in handy for me to know when 
my camera is on without me noticing.

## Dependencies
This extension works by listening on DBUS events sent to it whenever a camera or video device is in use.
To monitor those kernel events I use eBPF to trace C open calls on /dev/videoX devices, and 
for every trace event there is a DBUS method_call event sent on the session bus, to the extension.

## Design
```
+-----------3. Gnome Shell Camera Indicator DBus object--------------+
|              listends on a certain address on the                  |
|              session bus, and toggles the indicator                |
|              accordingly                                           |
|                                                                    |
|      +-----------2. eBPF trace in userspace-----------------+      |
|      |           catches the trace events and               |      |
|      |           emits a DBus event to the dbus             |      |
|      |           address of the extension                   |      |
|      |                                                      |      |
|      |            +-----1. Kernel--------------+            |      |
|      |            |     eBPF sens and events   |            |      |
|      |            |     on each c:open call    |            |      |
|      |            |     for /dev/videoX        |            |      |
|      |            |                            |            |      |
|      |            |                            |            |      |
|      |            |                            |            |      |
|      |            |                            |            |      |
|      |            |                            |            |      |
|      |            |                            |            |      |
|      |            +----------------------------+            |      |
|      +------------------------------------------------------+      |
+--------------------------------------------------------------------+
```
  
# Install using your browser 

See the [gnome extensions page](https://extensions.gnome.org/extension/TODO/)  

# Install from source

Checkout `master` branch for latest available, or `gnome-shell-x.xx` for a specific version.

Clone, Pack, and Install

```console
$ git clone https://github.com/rgolangh/gnome-shell-extension-camera-indicator
$ make all
// relogin to wayland or on xorg reload gnome-shell with Alt+F2 and r
```

Enalble using `make enable` or using 'Tweaks' -> Extensions -> toggle 'Containers'

