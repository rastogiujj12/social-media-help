var keystone = require('./../ks');
var Types = keystone.Field.Types;

/**
 * DirectorCut Model
 * ==========
 */
var DirectorCut = new keystone.List('DirectorCut');

DirectorCut.add({
    view:    { type: Number, required:true, initial: true },
	time:    { type: Number, required:true, initial: true },
    default: { type: Boolean, required:false }
});


/**
 * Registration
 */
DirectorCut.defaultColumns = 'time';
DirectorCut.register();