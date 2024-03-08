
# Banking PDF Parser

This project takes account states in PDF format to return a normalized json or csv version.
Currently only supports BBVA account states in Spanish for Mexican accounts. 

### How to deploy locally.
##### Requirements.
- node >=18.x
- npm >=8.x

```bash
npm install -g typescript
npm install

npm run test:bbva
```

### Deploy in lambda.
Follow the instructions in update-lambda.sh, by now its mandatory to have a lambda 
created with nodejs runtime conf, and named financials-pdf-parsing.
```bash
npm run build
zip -qr project.zip dist node_modules
mkdir -p static
mv project.zip static/project.zip
touch static/update_log.txt
aws lambda update-function-code --function-name financials-pdf-parsing --zip-file fileb://static/project.zip > static/update_log.txt
cat static/update_log.txt
```

### Wanna collaborate?
Here's a list of the current tech debt.
- [ ] There's an error with typescript aliases, they are not recognized while running tsc-node.
- [ ] A lot of any types to be deleted.
- [ ] There's a bug when reading states account with more than one year of coverage.
- [ ] There's any exception logging implemented (something like sentry).

Also feel free to add others account states compatibility, aproaches to handle
more than one language or bank are more than welcome.

### Collaborators
@carlosforcss - Carlos David Sanchez Moreno - Author.

