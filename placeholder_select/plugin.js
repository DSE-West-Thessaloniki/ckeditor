/**
 * A plugin to enable placeholder tokens to be inserted into the CKEditor message. Use on its own or with teh placeholder plugin. 
 * The default format is compatible with the placeholders syntax
 *
 * @version 0.2
 * @Author Troy Lutton, Intzoglou Theofilos
 * @license MIT 
 * 
 * This is a pure modification for the placeholders plugin. All credit goes to Stuart Sillitoe for creating the original (stuartsillitoe.co.uk)
 *
 */

CKEDITOR.plugins.add('placeholder_select',
{
	lang: ['en', 'el'],
	requires : ['richcombo'],
	init : function( editor )
	{
		//  array of placeholders to choose from that'll be inserted into the editor
		var placeholders = [];
		var buildListHasRunOnce = 0;
		
		var buildList = function()
		{
			// init the default config - empty placeholders
			var defaultConfig = {
				format: '[[%placeholder%]]',
				placeholders : []
			};

			// merge defaults with the passed in items		
			var config = CKEDITOR.tools.extend(defaultConfig, editor.config.placeholder_select || {}, true);

			if (buildListHasRunOnce) {
				placeholders = [];
				$(this._.panel._.iframe.$).contents().find("ul").remove();
				this._.items = {};
				this._.list._.items = {};
			}
			// run through an create the set of items to use
			for (var i = 0; i < config.placeholders.length; i++) {
				// get our potentially custom placeholder format
				var placeholder = config.format.replace('%placeholder%', config.placeholders[i]);			
				placeholders.push([placeholder, config.placeholders[i], config.placeholders[i]]);
			}

			for (var i in placeholders)
			{
				this.add(placeholders[i][0], placeholders[i][1], placeholders[i][2]);
			}

			if (buildListHasRunOnce) {
				this._.committed = 0; // We have to set to false in order to trigger a complete commit()
				this.commit();
			}

			buildListHasRunOnce = 1;
		}

		// add the menu to the editor
		editor.ui.addRichCombo('placeholder_select',
		{
			label: 		editor.lang.placeholder_select.dropdown_label,
			title: 		editor.lang.placeholder_select.dropdown_title,
			voiceLabel: editor.lang.placeholder_select.dropdown_voiceLabel,
			className: 	'cke_format',
			multiSelect:false,
			panel:
			{
				css: [].concat(editor.config.contentsCss).concat(CKEDITOR.skin.getPath('editor')),
				voiceLabel: editor.lang.placeholder_select.panelVoiceLabel
			},

			init: function()
			{
				this.startGroup( this.label );
                var rebuildList = CKEDITOR.tools.bind(buildList, this);
                rebuildList();
			},

			buildList: function(){
                var rebuildList = CKEDITOR.tools.bind(buildList, this);
                rebuildList();
			},

			onClick: function( value )
			{
				editor.focus();
				editor.fire( 'saveSnapshot' );
				editor.insertHtml(value);
				editor.fire( 'saveSnapshot' );
			}
		});
	}
});
