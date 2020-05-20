### windows中快捷键 & dos命令
    cmd文件:windows环境下的可执行文件
    windows + R 调出运行模板 ; 输入 cmd 调出dos窗口
    windows + E 调出资源管理器

    cls : 清屏操作
    set : 查看当前windows操作系统的环境变量
    set name : 查看指定的环境变量
    set name=val : 设置环境变量(一次性的设置 关掉命令行窗口后 设置就会失效)
    set name= : 删除环境变量

### npm相关的命令
    npm root -g : 查看电脑上全局安装的包
    npm init -y : 生成项目的描述文件(package.json)
    npm 脚本:
        npm run 脚本的名字(如果说脚本的名字叫start 则run可以省略)
        npm脚本执行windows命令 它会自动在项目的node_modules中.bin中去寻找对应的命令

### vue2.0 脚手架
    安装2.0的脚手架 : npm i vue-cli -g
    查看脚手架的版本 : vue -V
    查看脚手架可选的模板: vue list
    初始化项目 : vue init webpack projectname
    启动项目 : npm start

### 解读vue项目启动的流程
    1. 安装2.0的脚手架 npm i vue-cli -g
        C:\Users\alienware\AppData\Roaming\npm\node_modules\vue-cli\bin 存放脚手架相关的命令
        C:\Users\alienware\AppData\Roaming\npm  也会存放一份脚手架相关的命令 并且 有其对应的cmd文件
        C:\Users\alienware\AppData\Roaming\npm  在windows的环境变量中有配置

    2. 执行vue -V命令
       执行vue list
       执行vue init webpack demo2
        C:\Users\alienware>vue -V :
            去 C:\Users\alienware目录中找vue.cmd命令 发现没有这个命令
            去 系统环境变量的每一个文件夹中找 vue.cmd命令 发现没有这个命令
            去 用户环境变量的每一个文件夹中找 vue.cmd命令  发现有这个命令 则执行
            如果都没找到 则报错!

    3. 创建出一个vue项目 并启动: demo2
        进入到项目目录下: 执行 npm start
                         执行 npm run dev
                          执行 webpack-dev-server --inline --progress --config build/webpack.dev.conf.js


    4. webpack-dev-server webpack-dev-server --inline --progress  --config build/webpack.dev.conf.js
        webpack-dev-server 是webpack的内置服务器
            他不光可以启动一个服务器;而且可以进行webpack打包

        --inline --progress : 打印服务器启动的进度

        --config build/webpack.dev.conf.js: 指定webapck的配置文件

    5. 分析webpack.dev.conf.js webpack.base.conf.js
        发现在webpack.dev.conf.js中合并了baseWebpackConfig;开发环境的配置需要去去读两个文件的
            : webpack.dev.conf.js  webpack.base.conf.js

            打包的入口:'./src/main.js'
            打包成功之后会生成一个 app.js文件
            HtmlWebpackPlugin 会将生成的app.js文件注入到index.html中

    6. 访问localhost:8080
            访问到  index.html

    7. 脚手架与windows环境变量的结合


### 打包时的一些细节 (包的查找机制)
    main.js --> app.js




