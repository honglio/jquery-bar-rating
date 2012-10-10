/**
 * jQuery Bar Rating Plugin
 *
 * http://github.com/netboy/jquery-bar-rating
 *
 * Copyright (c) 2012 Kazik Pietruszewski
 *
 * Dual licensed under the MIT and GPL licenses:
 * http://www.opensource.org/licenses/mit-license.php
 * http://www.gnu.org/licenses/gpl.html
 */
(function () {

    (function ($) {
        var BarRating, root, hasTouch;
        root = typeof window !== "undefined" && window !== null ? window : global;
        hasTouch = 'ontouchstart' in root;

        root.BarRating = BarRating = (function () {

            function BarRating() {
                this.show = function () {

                    var $this = $(this.elem),
                        userOptions = this.options,
                        data = $this.data('barrating'),
                        $widget,
                        $all,
                        updateRating,
                        clickEvent = hasTouch ? 'touchstart' : 'click';

                    $this.data('barrating', {
                        initialized:true,
                        currentRating:$this.val() // initial rating based on the OPTION value
                    });

                    // run only once
                    if (!data || data.initialized === false) {
                        $widget = $('<div />', { 'class':'bar-rating' }).insertAfter(this.elem);

                        // create A elements that will replace OPTIONs
                        $(this.elem).find('option').each(function () {
                            var val, aText, $a, $span;

                            val = $(this).text();
                            aText = (userOptions.showValues) ? val : '';
                            $a = $('<a />', { href:'#', 'data-rating':val });
                            $span = $('<span />', { text:aText });

                            $widget.append($a.append($span));

                        });

                        if (userOptions.showSelectedRating) {
                            $widget.append($('<div />', { text:'', 'class':'current-rating' }));

                            // update text on rating change
                            $widget.find('.current-rating').on('ratingchange',
                                function () {
                                    $(this).text($this.data('barrating').currentRating);
                                }).trigger('ratingchange');

                        }

                        // will be reused later
                        updateRating = function () {

                            // some rating was already selected?
                            if ($this.data('barrating').currentRating !== undefined) {
                                $widget.find('a[data-rating="' + $this.data('barrating').currentRating + '"]')
                                    .addClass('selected current')
                                    .prevAll().addClass('selected');
                            }
                        };

                        updateRating();

                        $all = $widget.find('a');

                        // make sure click event doesn't cause trouble on touch devices
                        if (hasTouch) {
                            $all.on('click', function (event) {
                                event.preventDefault();
                            });
                        }

                        $all.on(clickEvent, function (event) {
                            var $a = $(this);

                            event.preventDefault();

                            $all.removeClass('active selected current');
                            $a.addClass('selected current')
                                .prevAll().addClass('selected');

                            // remember selected rating
                            $this.data('barrating').currentRating = $a.attr('data-rating');

                            // change selected OPTION in the select box (now hidden)
                            $this.val($a.attr('data-rating'));

                            $widget.find('.current-rating').trigger('ratingchange');

                            return false;

                        });

                        // attach mouseenter/mouseleave event handlers
                        if (!hasTouch) {

                            $all.on({
                                mouseenter:function () {
                                    var $a = $(this);
                                    $all.removeClass('active').removeClass('selected');
                                    $a.addClass('active').prevAll().addClass('active');
                                }
                            });

                            $widget.on({
                                mouseleave:function () {
                                    $all.removeClass('active');
                                    updateRating();
                                }
                            });
                        }

                        // hide the select box
                        $this.hide();
                    }
                }
                this.destroy = function () {
                    var $this = $(this.elem);

                    $this.removeData('barrating');
                    $('.bar-rating, .bar-rating a').off().remove();

                    // show the select box
                    $this.show();
                }
            }

            BarRating.prototype.init = function (options, elem) {
                var self;
                self = this;
                self.elem = elem;

                return self.options = $.extend({}, $.fn.barrating.defaults, options);
            };

            return BarRating;

        })();

        $.fn.barrating = function (method, options) {
            return this.each(function () {
                var pluginObjectName;
                pluginObjectName = new BarRating();

                // method supplied
                if (pluginObjectName.hasOwnProperty(method)) {
                    pluginObjectName.init(options, this);
                    return pluginObjectName[method]();

                    // no method supplied or only options supplied
                } else if (typeof method === 'object' || !method) {
                    options = method;
                    pluginObjectName.init(options, this);
                    return pluginObjectName.show();

                } else {
                    $.error('Method ' + method + ' does not exist on jQuery.barrating');
                }

            });
        };
        return $.fn.barrating.defaults = {
            showValues:false,
            showSelectedRating:true
        };
    })(jQuery);

}).call(this);
