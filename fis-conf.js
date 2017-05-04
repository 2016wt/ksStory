 
// 设置项目属性
fis.set('project.name', 'm');
fis.set('project.static', '/src');
fis.config.set('modules.preprocessor.css', 'image-set');
/* global fis */
fis.hook('commonjs', {
    wrap: false,
    baseUrl: './modules'
});
// fis.hook('relative');
// fis.match('**', {
//     relative: true
// });

    fis.match('**/*.scss', {
        rExt: '.css', // from .scss to .css
        parser: fis.plugin('node-sass', {
            //fis-parser-node-sass option
        }),
        postprocessor: fis.plugin('autoprefixer', {
            browsers: ["Android >= 4", "ChromeAndroid > 1%", "iOS >= 6","Firefox >= 20","last 3 Safari versions","last 2 Explorer versions","last 1 Chrome versions","last 2 versions","Firefox ESR","> 5%"] // wap
        })
    });

    fis.config.merge({
        modules : {
            preprocessor : {
                //css后缀文件会经过fis-preprocessor-image-set插件的预处理
                css : 'image-set'
            }
        }
    });

    fis.match('::package', {
        postpackager: fis.plugin('loader', {
            resourceType: 'mod'
        }),
        spriter: fis.plugin('csssprites', {
            layout: 'matrix',
            scale: 0.5, 
            margin: '10'
        })
    })
    /**
     * 语言能力拓展相关
     * */
    .match('*.{html,js,css}', {
        useSameNameRequire: true
    })
    .match('**/*.{css,scss}', {
        rExt: '.css', // from .scss to .css
        parser: fis.plugin('node-sass', {
            //fis-parser-node-sass option
        }),
        paser: fis.plugin('image-set'),
        useSprite: true,
        postprocessor: fis.plugin('autoprefixer', {
            browsers: ["Android >= 4", "ChromeAndroid > 1%", "iOS >= 6","Firefox >= 20","last 3 Safari versions","last 2 Explorer versions","last 1 Chrome versions","last 2 versions","Firefox ESR","> 5%"] // wap
        })
    })

    /**
     * 模块化相关
     * */
    .match('/components/framework7/plugins/*.js', {
        requires:[
            '/components/framework7/framework7.js'
        ]
    })
    .match('/components/**/*.js', {
        isMod: true,
        requires:[
            ''
        ]
    })
    // ------ 配置components
    .match('/components/**', {
        release: '${project.static}/$&'
    })
    .match('/components/**.css', {
        isMod: true,
        release: '${project.static}/$&'
    })
    .match('/components/**.js', {
        isMod: true,
        release: '${project.static}/$&'
    })
    .match(/^\/modules\/(.*)\.(js)$/i, {
        id: '$1',
        isMod: true
    })
    // 支出N层的短名引用
    // 'modules/a/b/c/c.js' => require('a/b/c');
    .match(/\/modules\/(((.*)\/)?([^\/]+))\/\4\.js/i, {
        id : '$1',
        isMod: true
    })
    .match('/modules/(**)', {
        release: '${project.static}/$1'
    })
    // 配置css
    .match(/^\/modules\/(.*\.scss)$/i, {
        rExt: '.css',
        isMod: true,
        release: '${project.static}/$1',
        parser: fis.plugin('node-sass', {
            include_paths: ['modules/css', 'components'] // 加入文件查找目录
        }),
        postprocessor: fis.plugin('autoprefixer', {
             browsers: ["Android >= 4", "ChromeAndroid > 1%", "iOS >= 6","Firefox >= 20","last 3 Safari versions","last 2 Explorer versions","last 1 Chrome versions","last 2 versions","Firefox ESR","> 5%"] // wap
            //browsers: ['> 1% in CN', "last 2 versions", "IE >= 8"] // pc
            // browsers: ["Android >= 4", "ChromeAndroid > 1%", "iOS >= 6"] // wap
        })
    })
    .match(/^\/modules\/(.*\.css)$/i, {
        isMod: true,
        release: '${project.static}/$1',
        postprocessor: fis.plugin('autoprefixer', {
            browsers: ["Android >= 4", "ChromeAndroid > 1%", "iOS >= 6","Firefox >= 20","last 3 Safari versions","last 2 Explorer versions","last 1 Chrome versions","last 2 versions","Firefox ESR","> 5%"] // wap

            //browsers: ['> 1% in CN', "last 2 versions", "IE >= 8"] // pc
            // browsers: ["Android >= 4", "ChromeAndroid > 1%", "iOS >= 6"] // wap
        })
    })
    .match(/^\/modules\/(.*\.(?:png|jpg|gif))$/i, {
        release: '${project.static}/$1'
    })
    .match(/^\/modules\/(.*\.js)$/i, {
        isMod: true,
        release: '${project.static}/$1'
    })

    /**
     * 基础文件的路径设置及拷贝
     * */
    .match('/api/**/*',{
        release: '$0',

    })
    .match('/page/**/*',{
        release: '$0'
    })
    .match('/style/**/*',{
        release: '$0'
    })
    .match('/style/img/**/*',{
        release: '$0'
    });

    fis.match('*', {
      deploy: fis.plugin('local-deliver', {
        to: '/Users/wangtao/Sites'
      })
    });
    // 公用js
    var map = {
        'prd-local': {
            host: 'http://www.kaishustory.com',
            path: ''
        },
        'prd-test': {
            host: 'http://weixin.kaishustory.com',
            path: '/${project.name}'
        },
        'prd': {
            host: 'http://weixin.kaishustory.com',
            path: '/${project.name}'
        }
    };

    fis.util.map(map, function (k, v) {
    var domain = v.host + v.path;

    fis.media(k)
        .match('**.js', {
            useHash: true,
            domain: domain,
            optimizer: fis.plugin('uglify-js')
        })
        .match('**.{scss,css}', {
            useSprite: true,
            useHash: true,
            domain: domain,
            optimizer: fis.plugin('clean-css')
        })
        .match('**.html', {
            optimizer: fis.plugin('html-minifier')
        })
        .match('::image', {
            useHash: true,
            domain: domain
        })
        .match('**/(*_{x,y,z}.png)', {
            release: '/pkg/$1'
        })
        // 启用打包插件，必须匹配 ::package
        .match('::package', {
            spriter: fis.plugin('csssprites', {
                layout: 'matrix',
                scale: 0.5, // 移动端二倍图用
                margin: '10'
            }),
            postpackager: fis.plugin('loader', {
                allInOne: true,
            })
        })
        .match('/components/**.css', {
            packTo: '/pkg/components.css',
            optimizer: fis.plugin('clean-css')
        })
        .match('/components/**.js', {
            packTo: '/pkg/components.js',
            optimizer: fis.plugin('uglify-js')
        })
        .match('/modules/**.{scss,css}', {
            packTo: '/pkg/modules.css',
            optimizer: fis.plugin('clean-css')
        })
        .match('/modules/**.js', {
            packTo: '/pkg/modules.js',
            optimizer: fis.plugin('uglify-js')
        })
    });
    // fis3 release prod 产品发布，进行合并


    // 发布产品库
    fis.media('prd')
        .match('**.js', {
            optimizer: fis.plugin('uglify-js')
        })
        .match('**.{scss,css}', {
            optimizer: fis.plugin('clean-css', {
                'keepBreaks': true //保持一个规则一个换行
        })
    });


    // fis.media('prod')
    // .match('::package', {
    //     // preprocessor: fis.plugin('loader', {
    //     //     resourceType: 'mod'
    //     // }),
    //     // spriter: fis.plugin('csssprites', {
    //     //     layout: 'matrix',
    //     //     scale: 0.6, 
    //     //     margin: '10'
    //     // }),
    //     // postpackager: fis.plugin('loader', {
    //     //     allInOne: {
    //     //         css: 'pkg/web_app_${hash}.css',
    //     //         js: 'pkg/web_app_${hash}.js'
    //     //     }
    //     // })
    // })
    // .match('*.js', {
    //     useHash: true,
    //     optimizer: fis.plugin('uglify-js')
    // })
    // .match('**/*.{css,scss}', {
    //     rExt: '.css', // from .scss to .css
    //     parser: fis.plugin('node-sass', {
    //         //fis-parser-node-sass option
    //     }),
    //     paser: fis.plugin('image-set'),
    //     useSprite: true,
    //     postprocessor: fis.plugin('autoprefixer', {
    //         browsers: ["Android >= 4", "ChromeAndroid > 1%", "iOS >= 6"] // wap
    //     }),
    //     optimizer: fis.plugin('clean-css'),
    //     useHash: true,
    // })
    // .match('*.png', {
    //     optimizer: fis.plugin('png-compressor')
    // });

    fis.media('qa').match('*', {
      deploy: fis.plugin('local-deliver', {
        to: '/Users/wangtao/Sites'
      })
    });   