#!/usr/bin/env bash
if [ -d "build" ]; then
    rm -r build
fi

mkdir build
npm ci
npx tsc
cp src/index.html build
