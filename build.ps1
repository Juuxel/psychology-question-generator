rm -Recurse -Force build
mkdir build
npm install
npx tsc
cp src/index.html build/index.html
