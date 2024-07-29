# 自定義fzf
customfzf() {
    local prompt=$1
    local args=()

    # 從第二個參數開始，將所有參數加入到 args 陣列中
    for ((i = 2; i <= $#; i++)); do
        args+=("${@[$i]}")
    done

    fzf --prompt="$prompt " --height=30 --reverse --border --ansi --no-mouse --inline-info --cycle "${args[@]}"
}
