var lang = 'pl';

var GRID = (function() {

    var config = {

        tiles: null,
        tileOpts: {
            'name': 'kafelek',
            'name_en': 'tile',
            'color': 'default',
            'close': 'X'
        },
        templates: {
            'def': '<li class="tile-item" style="background:{{color}};"><p class="edit-tile" data-pl="{{name}}" data-en="{{name_en}}">{{name}}</p><span class="remove-tile">{{close}}</span></li>',
            'color': '<div class="color-item color-{{name}}" data-hex="{{hex}}" style="background:{{hex}}"></div>'
        },
        serialization: [
            {
                col: 1, row: 1, size_x: 1, size_y: 1   
            },
            {
                col: 2, row: 1, size_x: 1, size_y: 1
            },
            {
                col: 3, row: 1, size_x: 1, size_y: 1
            },
            {
                col: 4, row: 1, size_x: 1, size_y: 1
            },
            {
                col: 1, row: 2, size_x: 1, size_y: 1
            },
            {
                col: 2, row: 2, size_x: 1, size_y: 1
            },
            {
                col: 3, row: 2, size_x: 1, size_y: 1
            },
            {
                col: 4, row: 2, size_x: 1, size_y: 1
            }
        ],
        colors: [
            {
                name: 'none', hex: 'none'
            },
            {
                name: 'yellow', hex: '#F2E85E'
            },
            {
                name: 'orange', hex: '#F2BA5E'
            },
            {
                name: 'pink', hex: '#FA89E5'
            },
            {
                name: 'purple', hex: '#AD409F'
            },
            {
                name: 'green', hex: '#60BF6C'
            },
            {
                name: 'green2', hex: '#11691C'
            },
            {
                name: 'grey', hex: '#C5C9C6'
            }
        ]
    };

    var render = function(template, data, partials){
        var out = "";
        
        out = template.replace(/{{>s*(.+?)s*}}/gi, function(m,c,o,s) {
          c = $.trim(c);
          return !!partials[c] ? partials[c] : "";
        });
        
        out = out.replace(/{{s*(.+?)s*}}/gi, function(m,c,o,s) {
          c = $.trim(c);
          return !!data[c] ? data[c] : "";
        });

        return out;   
    };

    var checkIfMockup = function(){
        if (/mockup/.test(window.location.href)){
            return 'mockup'
        } else {
            return 'new'
        }
    };

    var changeLang = function(){
        !!lang && lang === 'pl' ? lang = 'en' : lang = 'pl';

        $('.edit-tile').each(function() {
            $(this).html( $(this).data(lang) );
        })
    };


    var handlers = function(){

        /** remove individual tile from grid **/
        $(document).on('click', '.remove-tile', function(){
            var el = $(this).parent();
            config.tiles.remove_widget(el);
        });  

        /** remove all tiles from grid **/
        $(document).on('click', '.remove-all', function(){
            config.tiles.remove_all_widgets();
        });

        /** set dedicated color to your new tile **/
        $(document).on('click', '.color-item', function(){
            config.tileOpts['color'] = $(this).data('hex');
            $('.color-item').css('border','none');
            $(this).css('border','2px solid #004756');
        });

        /** add new tile with specified name & color to grid **/
        $(document).on('click', '.add-tile', function(){
            config.tileOpts['name'] = $('.add-tile-input').val();
            config.tileOpts['name_en'] = $('.add-tile-input-en').val();

            config.tiles.add_widget( render(config.templates['def'], config.tileOpts), 1, 1, 1, 1);
        });

        /** show configuration box **/
        $(document).on('click', '.config-closed', function(){
            $(this)
                .addClass('config-opened')
                .removeClass('config-closed')
                .parent()
                    .animate({'right':0}, "slow");
        });

        /** hide configuration box **/
        $(document).on('click', '.config-opened', function(){
            $(this)
                .addClass('config-closed')
                .removeClass('config-opened')
                .parent()
                    .animate({'right':'-300px'}, "slow");
        });

        /** change language inside tiles **/
        $(document).on('click', '.change-lang', function(){
            changeLang();
        });

    };


    var init = function(tilespace){

        handlers();

        config.serialization = Gridster.sort_by_row_and_col_asc(config.serialization);

        config.tiles = $(tilespace).gridster({
            widget_base_dimensions: [120, 120],
            widget_margins: [10, 10],
            max_cols: 6,
            helper: 'clone',
            resize: {
                enabled: true,
                max_size: [6, 4]
            }
        }).data('gridster');


        $.each(config.colors, function(index) {
            var colorItem = render(config.templates['color'], this);
            $('.color-trial').append(colorItem);
        });


        $.each(config.serialization, function() {
            config.tiles.add_widget(render(config.templates['def'], config.tileOpts), this.size_x, this.size_y, this.col, this.row);
        }); 

    };

    return {
        init:init
    };

})();


$(function(){

    GRID.init(".gridster ul");


});
