module.exports = (client, message) => {
	client.snipes.set(message.channel.id, {
		content: message.content,
		author: message.author,
		image: message.attachments.first()
			? message.attachments.first().proxyURL
			: null,
	});
	setTimeout(function () {
		client.snipes.clear(message.channel.id);
	}, 300000);
};
