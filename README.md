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

## How

`svme` creates a JSON file in your OS's temporary directory. Values are simply
pushed to this file as you save them.
