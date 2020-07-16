import Plugin from '@ckeditor/ckeditor5-core/src/plugin';
import ButtonView from '@ckeditor/ckeditor5-ui/src/button/buttonview';
import imageIcon from '@ckeditor/ckeditor5-core/theme/icons/image.svg';

import bootbox from 'bootbox';

import audioIcon from '../theme/icons/audio.svg';
import videoIcon from '../theme/icons/video.svg';

const createFilebrowserModal = (editor, t, dialogTitle, onCreate, additionalInput = '') => {
	const dialog = bootbox.dialog({
		title: dialogTitle,
		message: `<label for="url-input">${t('URL')}:</label><br>
				  <input type="text" id="url-input">
				  <button type="button" id="browseServerButton">${t('Browse Server')}</button><br>${additionalInput}`,
		closeButton: false,
		buttons: {
			cancel: {
				label: t('Cancel'),
			},
			ok: {
				label: t('OK'),
				callback: onCreate,
			},
		},
	});
	dialog.on('shown.bs.modal', () => {
		document.getElementById('browseServerButton').addEventListener('click', () => {
			const dialogPageUrl = editor.config.get('filebrowser.browseUrl');
			const dialogWindow = window.open(dialogPageUrl, '_blank', 'width=700, height=500');
			dialogWindow.onload = () => {
				dialogWindow.callbackFunctionFileUrl = (imageUrl) => {
					document.getElementById('url-input').value = imageUrl;
				};
			};
		});
	});
};

export default class FileBrowserPlugin extends Plugin {
	init() {
		const { editor } = this;
		const { t } = editor;
		const { schema } = editor.model;
		const { conversion } = editor;

		schema.register('video', {
			allowWhere: '$block',
			isBlock: true,
			isObject: true,
			isLimit: true,
			allowAttributes: ['source', 'controls', 'controlslist'],
		});
		conversion.elementToElement({ view: 'video', model: 'video' });

		schema.register('audio', {
			allowWhere: '$block',
			isBlock: true,
			isObject: true,
			isLimit: true,
			allowAttributes: ['source', 'controls', 'controlslist'],
		});
		conversion.elementToElement({ view: 'audio', model: 'audio' });

		conversion.attributeToAttribute({ view: 'src', model: 'source' });
		conversion.attributeToAttribute({ view: 'controls', model: 'controls' });
		conversion.attributeToAttribute({ view: 'controlslist', model: 'controlslist' });

		editor.ui.componentFactory.add('imagebrowser', (locale) => {
			const view = new ButtonView(locale);

			view.set({
				label: t('Insert Image'),
				icon: imageIcon,
				tooltip: true,
			});

			view.on('execute', async () => {
				const additionalInput = `<label for="alt-text-input">${t('Alternative Text')}:</label><br>
				  <input type="text" id="alt-text-input">`;
				const dialogTitle = t('Image Properties');
				const onCreate = () => {
					const imageUrl = document.getElementById('url-input').value;
					const imageAltText = document.getElementById('alt-text-input').value;
					console.log('imageUrl: ', imageUrl);
					console.log('imageAltText: ', imageAltText);
					editor.model.change((writer) => {
						const imageElement = writer.createElement('image', {
							src: imageUrl,
							alt: imageAltText,
						});

						editor.model.insertContent(imageElement, editor.model.document.selection);
					});
				};
				createFilebrowserModal(editor, t, dialogTitle, onCreate, additionalInput);
			});

			return view;
		});

		editor.ui.componentFactory.add('videobrowser', (locale) => {
			const view = new ButtonView(locale);

			view.set({
				label: t('Insert Video'),
				icon: videoIcon,
				tooltip: true,
			});

			view.on('execute', async () => {
				const dialogTitle = t('Video Properties');
				const onCreate = () => {
					const videoUrl = document.getElementById('url-input').value;
					editor.model.change((writer) => {
						const videoElement = writer.createElement('video', {
							source: videoUrl,
							controls: 'true',
							controlslist: 'nodownload',
						});

						editor.model.insertContent(videoElement, editor.model.document.selection);
					});
				};
				createFilebrowserModal(editor, t, dialogTitle, onCreate);
			});

			return view;
		});

		editor.ui.componentFactory.add('audiobrowser', (locale) => {
			const view = new ButtonView(locale);

			view.set({
				label: t('Insert Audio'),
				icon: audioIcon,
				tooltip: true,
			});

			view.on('execute', async () => {
				const dialogTitle = t('Audio Properties');
				const onCreate = () => {
					const audioUrl = document.getElementById('url-input').value;
					editor.model.change((writer) => {
						const audioElement = writer.createElement('audio', {
							source: audioUrl,
							controls: 'true',
							controlslist: 'nodownload',
						});

						editor.model.insertContent(audioElement, editor.model.document.selection);
					});
				};
				createFilebrowserModal(editor, t, dialogTitle, onCreate);
			});

			return view;
		});
	}
}
