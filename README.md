## Prestans 2.0 Google Closure Library Extensions

Prestans provides a number of extensions to Closure Library, that ease and automate building rich JavaScript clients that consume your Prestans API. Our current line up includes:

- REST Client, provides a pattern to create Xhr requests, manages the life cycle and parsers responses, also supports Attribute Fitlers.
- Types API, a client side replica of the Prestans server types package assisting with parsing responses.
- Code generation tools to quickly produce client side stubs from your REST application models.
- 

### Installation

Our client library follows the same development philosophy as Google Closure library, although we make available downloadable versions of the client library it's highly recommended that you reference our repository as an external source.

This allows you to keep up to date with our code base and benefit from the latest patches when you next compile.

Closure library does the same, and we ensure that we are leveraging off their latest developments.

### Unit Testing
1. To calculate dependencies prestans expects the closure directory to located at the same level and named "closure-library".

	<code>
	ls
	closure-library		prestans
	</code>

1. run the calcdeps.sh script

	<code>
	./calcdeps.sh
	</code>

1. Open any html file located in the source in a web browser to run unit tests for the corresponding javascript file.
