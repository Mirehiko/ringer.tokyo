var path = 'app/images/works/';
var video_path = 'app/video/';
var textData = [
	{
		type: 'info',
		title: 'Work preview',
		category: 'test',
		client: 'SuperSonic Co.',
		launch: '2019.12.01',
	},
	{
		type: 'integrated_video',
		src: '<iframe frameborder="0" width="480" height="270" src="https://www.dailymotion.com/embed/video/k2vFjUZvXsWMd0s8ina" allowfullscreen allow="autoplay"></iframe>',
		title: 'Integrated video 1',
		id: 'video1',
		color: '',
		previewImage: path + 'preview1.jpeg',
	},
	{
		type: 'integrated_video',
		src: '<iframe width="853" height="480" src="https://www.youtube.com/embed/-xbSRzOWCJg" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>',
		title: 'Integrated video 2',
		id: 'video2',
		color: '',
		previewImage: path + 'preview2.jpg',
	},
	{
		type: 'video',
		srcMP4: video_path + 'my_first_story_missing_you_720p.mp4',
		title: 'Own video 3',
		id: 'video3',
		color: '',
		previewImage: path + 'preview3.jpg',
	},
	{
		type: 'image',
		src: path + 'iamnext.jpg',
		alt: 'image3',
	},
	{
		type: 'image',
		src: path + 'deki2_4.jpg',
		alt: 'image4',
	}
];
