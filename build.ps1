if (Test-Path build) {
    Remove-Item -Recurse -Force build
}

mkdir build
npm ci
npx tsc
Copy-Item src/index.html build/index.html
