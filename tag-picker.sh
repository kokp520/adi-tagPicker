#!/bin/bash
# auth adi

# basic source file
source ~/.alias
for file in /Users/adi/tools/sh/lib/*.zsh; do source $file; done

# handle tag
selectTag=$(git tag | sort -V | customfzf "tag" --preview 'git show --color=always {}')

if [ -z "$selectTag" ]; then
    echo "No tag selected"
    exit 0
fi

markPrefix="-"
# 因為freedom是用 - 後面接version 所以用 - 如果其他地方要使用 可以改成 v
ver=$(echo "$selectTag" | awk -F"[.$markPrefix]" '{for(i=1; i<=NF; i++) if ($i ~ /^[0-9]+$/) {printf "%s ", $i; if (split($i, a, ".") == 3) break}}')

for ((i = 1; i <= 3; i++)); do
    verArray[i]=$(echo "$ver" | tr ' ' '\n' | sed -n "${i}p")
done

# 檢查是否成功提取到三個版本號
if [ ${#verArray[@]} -ne 3 ]; then
    echo "提取版本號失敗, 長度是 ${#verArray[@]}"
    exit 1
fi

# choose level
levelOption=("fix" "mid" "main")

level=$(
    printf "%s\n" "${levelOption[@]}" |
        customfzf "請選擇tag level： "
)

if [[ -z $level ]]; then
    echo "exit.... -z level == nil "
    exit 1
fi

# sort tag version
if [[ "$level" =~ ^(fix|mid|main)$ ]]; then
    case "$level" in
    main)
        # 把v2.0.0 修正大版本
        ((verArray[1]++))
        ((verArray[2] = 0))
        ((verArray[3] = 0))
        ;;
    mid)
        # v1.2.0 修正中版本 新增功能
        ((verArray[2]++))
        ((verArray[3] = 0))
        ;;
    fix)
        # 新增fix bug版號就好
        ((verArray[3]++))
        ;;
    esac
    newVer="${verArray[1]}.${verArray[2]}.${verArray[3]}"
    ########################################################################
    # -E 選項表示使用擴展正則表達式。
    # s/([0-9]+\.[0-9]+\.[0-9]+)/$newVer/ 是替換模式：
    # ([0-9]+\.[0-9]+\.[0-9]+)：匹配一個版本號，格式為 x.x.x，其中 x 是數字。
    # /：分隔符，表示替換模式的開始和結束。
    # $newVer：替換後的新版本號。
    #######################################################################
    newTag=$(echo "$selectTag" | sed -E "s/([0-9]+\.[0-9]+\.[0-9]+)/$newVer/") # sed取代原本版號
    # git tag -d "$select_tag"
    green "Tag '$selectTag' has been replaced with '$newVer' >>> $newTag"
    green "執行 git tag $newTag..."
    git tag "$newTag"
    green "完成!"
else
    echo "Invalid option. Please choose fix, mid, or main."
fi
