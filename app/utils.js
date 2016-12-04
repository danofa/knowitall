/// <reference path="typings/tsd.d.ts" />

var mongoose = require('mongoose');
var Articles = mongoose.model('Article');
var Topics = mongoose.model('Topic');

function calculateAritcleCounts(callback) {
	Topics.update({}, { $set: { child_articles_count: 0 } }, { multi: true, upsert: true }).exec(function (err) {
		if (err) console.error(__filename + " : " + err);

		Articles.find(function (err, articles) {
			if (err) console.error(__filename + " : " + err);
			articles.forEach(function (article) {
				if (article.group !== null) {
					incrementAritclesCount(article.group);
				}
			});
			callback();
		});
	})
}

function incrementAritclesCount(id, callback) {
	Topics.findOneAndUpdate({ '_id': id }, { $inc: { child_articles_count: 1 } }, function (err, topic) {
		if (err) return callback(err);

		if (topic !== null && topic.parent !== null) {
			incrementAritclesCount(topic.parent, callback)
		} else {
			if (typeof callback !== 'undefined') callback();
		}
	});
}

module.exports = {
	incrementAritclesCount: incrementAritclesCount,
	calculateAritcleCounts: calculateAritcleCounts
}  
