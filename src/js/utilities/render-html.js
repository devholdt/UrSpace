const ejs = require("ejs");
const fs = require("fs");
const path = require("path");

const renderFile = (templatePath, outputPath) => {
	const template = fs.readFileSync(templatePath, "utf-8");
	const renderedHtml = ejs.render(template, { env: process.env });

	fs.writeFileSync(outputPath, renderedHtml, "utf-8");
};

renderFile(
	path.join(__dirname, "../../../templates/index.ejs"),
	path.join(__dirname, "../../../dist/index.html")
);
renderFile(
	path.join(__dirname, "../../../templates/feed.ejs"),
	path.join(__dirname, "../../../dist/feed.html")
);
renderFile(
	path.join(__dirname, "../../../templates/profile.ejs"),
	path.join(__dirname, "../../../dist/profile.html")
);
