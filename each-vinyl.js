
const PluginError = require('plugin-error');
const through = require('through2');
const Buffer = require('safe-buffer').Buffer;

module.exports = function eachVinyl (plugin_name, fn) {
	return function compile(data) {
		return through.obj(function (file, enc, cb) {
			if( file.isNull() ) {
				cb(null, file);
				return;
			}

			if( file.isStream() ) {
				cb(new PluginError(plugin_name, 'Streaming not supported'));
				return;
			}

			try {
				fn.call(this, file);
				this.push(file);
			} catch (err) {
				this.emit('error', new PluginError(plugin_name, err, { fileName: file.path }));
			}

			cb();
		});
	}
}
