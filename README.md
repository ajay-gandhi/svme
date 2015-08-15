# svme

> Store and load temporary data with your terminal

`svme` (short for Save Me) is a utility for quickly and effortlessly storing
small bits of data. The data is stored temporarily, i.e. it is deleted
automatically when your machine reboots.

## Usage

First, install with `npm`:

```bash
$ npm install -g svme
```

To save some data:

```bash
$ svme save "i'm saving this"
```

To load the data:

```bash
$ svme load
```

Run `svme help load` for more details on loading data.

### Piping

You can even pipe data to `svme`:

```bash
$ ls | svme save
```

## How

`svme` creates a JSON file in your OS's temporary directory. Values are simply
pushed to this file as you save them.

## Why

If you're ever receiving data from a process and would like to save the output,
this utility can come in handy. In doesn't interfere with your clipboard and can
save many sets of data simultaneously. Additionally, you don't need to worry
about taking up space since it gets cleared automatically on reboot.
