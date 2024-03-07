echo "Building Project..."
npm run build
echo "Compressing zip package..."
zip -qr project.zip dist node_modules
echo "Setting up zip file..."
mkdir -p static
mv project.zip static/project.zip
echo "Uploading zip file to lambda..."
touch static/update_log.txt
aws lambda update-function-code --function-name financials-pdf-parsing --zip-file fileb://static/project.zip > static/update_log.txt
cat static/update_log.txt
echo "Lambda updated successfully!"
