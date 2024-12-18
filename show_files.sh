#!/bin/bash

# 開啟 globstar
shopt -s globstar

# 顯示所有 .js 檔案內容，並加上分隔標題
for file in src/**/*.js; do 
    echo -e "\n=== $file ===\n"
    cat "$file"
done
