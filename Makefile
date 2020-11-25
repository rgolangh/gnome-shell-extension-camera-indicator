EXTRA_SOURCES = \
	podman-icon.png experiment.js podman.js

all: \
	build \
	install \
	enable

build:
	# gnome-extensions pack -f $(addprefix --extra-source=,$(EXTRA_SOURCES))	
	gnome-extensions pack -f

install:
	gnome-extensions install -f camera-indicator@royg.shell-extension.zip

enable:
	gnome-extensions enable camera-indicator@royg

.PHONY: build install enable all

