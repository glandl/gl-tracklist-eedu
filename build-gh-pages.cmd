node --openssl-legacy-provider node_modules/@angular/cli/bin/ng build --prod --base-href "https://glandl.github.io/gl-tracklist-eedu/"
npx angular-cli-ghpages --dir=dist/gl-tracklist-eedu

#eEducation Server
node --openssl-legacy-provider node_modules/@angular/cli/bin/ng build --prod --base-href "https://eeducation.at/tagungsprogramm/"
