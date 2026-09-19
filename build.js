/* Static prerender: data + components + css -> index.html, standalone.html */
const fs = require('fs');
const path = require('path');
const data = require('./src/data');
const { Page } = require('./src/components');

const cssFiles = ['tokens', 'base', 'hero', 'offers', 'footer'];
const css = cssFiles.map((f) => fs.readFileSync(path.join(__dirname, 'src/css', f + '.css'), 'utf8')).join('\n');
const js = fs.readFileSync(path.join(__dirname, 'src/client.js'), 'utf8');

const fonts = 'https://fonts.googleapis.com/css2?family=Baloo+Da+2:wght@600;700;800&family=Caveat:wght@400;600&family=Hind+Siliguri:wght@400;500;600;700&display=swap';
const s = data.site;

const doc = ({ inline }) => `<!doctype html>
<html lang="${s.lang}" class="no-js">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>${s.title}</title>
<meta name="description" content="${s.description}">
<meta name="theme-color" content="#2f88ee">
<meta property="og:title" content="${s.title}">
<meta property="og:description" content="${s.description}">
<meta property="og:type" content="website">
<script>document.documentElement.className='js'</script>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="${fonts}">
${inline ? `<style>\n${css}\n</style>` : '<link rel="stylesheet" href="assets/styles.css">'}
</head>
<body>
${Page(data)}
${inline ? `<script>\n${js}\n</script>` : '<script src="assets/app.js" defer></script>'}
</body>
</html>
`;

fs.mkdirSync(path.join(__dirname, 'assets'), { recursive: true });
fs.writeFileSync(path.join(__dirname, 'assets/styles.css'), css);
fs.writeFileSync(path.join(__dirname, 'assets/app.js'), js);
fs.writeFileSync(path.join(__dirname, 'index.html'), doc({ inline: false }));
fs.writeFileSync(path.join(__dirname, 'standalone.html'), doc({ inline: true }));
console.log('built', fs.statSync('index.html').size, 'B html,', css.length, 'B css');
