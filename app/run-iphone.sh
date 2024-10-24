#!/bin/zsh

if [[ "$@" == *"watchman"* ]]; then
    watchman watch-del-all
    watchman shutdown-server
fi

if [[ "$@" == *"clean"* ]]; then
    cd ios
    xcodebuild clean
fi

cd ios
bundle install
bundle exec pod install
cd ..
npx react-native run-ios --device "iPhone" --port 8888
