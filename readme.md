# auto-tagger

<h1 align="center">Welcome to auto-tagger 👋</h1>
<p>
  <a href="https://www.npmjs.com/package/auto-tagger" target="_blank">
    <img alt="Version" src="https://img.shields.io/npm/v/auto-tagger.svg">
  </a>
  <a href="#" target="_blank">
    <img alt="License: MIT" src="https://img.shields.io/badge/License-MIT-yellow.svg" />
  </a>
</p>

>This is a simple tag picker for using with git tags.
>Cause Doing the project development always tag a new version with develop feature.
>You can use this script to choose the tag version u want to use.

>Maybe your app with the complex tag like `kernel-mircoservice-v1.2.3` ...
>imagine the product have 10 services.

>Hope can save your time.

# Support

- shell script
- npm 

## Npm

- name: auto-tagger

- [auto-tagger](https://www.npmjs.com/package/@kokp520/auto-tagger)

### Install

run this command to install the package.
```
npm install -g auto-tagger
```

Go to your project directory with .git and run this command.
```
cd /file/to/your/project/; auto-tagger
```

And you will see the tag list.
![alt text](images/auto-tagger-1.png)

Choose the tag for the last commit.

![alt text](images/auto-tagger-2.png)

AND DON'T FORGET TO PUSH THE TAG TO THE REMOTE REPO.

After that, I will optimize the auto push feature to the remote repo.
```
git push --tags
```

## Shell

### Install 
install fzf using brew:
```
brew install fzf
```

### Usage

you can use my aother repo name adi-dosh for alias sheel script.

alias.sh >>>
![alt text](images/image.png)

choose adi-tagPicker.sh >>>
![alt text](images/image-1.png)

版本的選擇規則為:
opt=("main", "mid", "fix")

選擇main調整大版本號, mid為新服務更新, fix為bug修復版本號
main => 2.0.0 
mid => 1.3.0
fix => 1.2.4 

![alt text](images/image-2.png)

## Author

👤 **adi**

## Donation

[![](https://www.paypalobjects.com/en_US/i/btn/btn_donateCC_LG.gif)](https://www.paypal.com/ncp/payment/RTFS76RU2S7RW)

## Show your support

Give a ⭐️ if this project helped you!

***
_This README was generated with ❤️ by [readme-md-generator](https://github.com/kefranabg/readme-md-generator)_
