## Prestans 2.0 Google Closure Library Extensions

Prestans provides a number of extensions to Closure Library, that ease and automate building rich JavaScript clients that consume your Prestans API. Our current line up includes:

- REST Client, provides a pattern to create Xhr requests, manages the life cycle and parsers responses, also supports Attribute Fitlers.
- Types API, a client side replica of the Prestans server types package assisting with parsing responses.
- Code generation tools to quickly produce client side stubs from your REST application models.

### Installation

Our client library follows the same development philosophy as Google Closure library, although we make available downloadable versions of the client library it's highly recommended that you reference our repository as an external source.

This allows you to keep up to date with our code base and benefit from the latest patches when you next compile.

Closure library does the same, and we ensure that we are leveraging off their latest developments.

### Unit Testing

Adjust the ``DEPSWRITER`` variable in the calcdeps.sh script and run it in the prestans-client directory.
	
    cd prestans-client
    ./calcdeps.sh

To run these unit tests you will need to start Google Chrome with ``--allow-file-access-from-files`` parameter. Example on Mac OS X:

    /Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome --allow-file-access-from-files
