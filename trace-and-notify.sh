#!/bin/bash

# this program will trace the kernel for open/read/close of video devices(not the content!) and
# and will send a DBus message for each event, with the destination of the gnome-shell extension.

DEVICE="/dev/video0"
TRACE_BIN=/usr/share/bcc/tools/trace

function trace_cmd() {
    sudo ${TRACE_BIN} "${1} (STRCMP(\"${2}\", arg1) == 1) \"%s\" arg1"
}

function dbus_cmd() {
    gdbus call --session --dest org.gnome.Shell --object-path /org/cam/Bus --method org.cam.Bus.deviceEvent foo ${1}
}

# TODO trace multi events and control under this script
trace_cmd c:open  "${DEVICE}" | while read line; do dbus_cmd true; done

# TODO close event is not emited - find out which one is it 
#trace_cmd c:close "${DEVICE}" | while read line; do dbus_cmd false; done

