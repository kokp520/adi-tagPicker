# echo color

## example 
# echo "$(red 'This text is red.')"
# echo "$(purple 'This text is purple.')"
# echo "$(yellow 'This text is yellow.')"

# green "this is green"
# read "$(green 'this text is greeen.')"

green(){
    local t="$1"
    echo -n -e "\e[32m$t\e[0m"
    echo
}

red() {
    local t="$1"
    echo -n -e "\e[31m$t\e[0m"
    echo
}

purple() {
    local t="$1"
    echo -n -e "\e[35m$t\e[0m"
    echo
}

yellow() {
    local t="$1"
    echo -n -e "\e[33m$t\e[0m"
    echo
}
