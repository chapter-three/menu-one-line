/**
 * @file
 * Restricts Drupal native main menu to display on only one line
 */

(function ($) {

/**
 *
 */
Drupal.behaviors.menu_one_line = {
  attach: function (context, settings) {
    var menu_one_line = Drupal.settings.menu_one_line;
    var menu_one_line_class = menu_one_line['class'];

    main_menu_check_for_two_lines();

    $(window).resize(function() {
      clearTimeout();
      setTimeout(doneResizing, 800);
    });


    // check if menu links wrap to two lines
    function main_menu_check_for_two_lines() {

      var main_menu =  $(menu_one_line_class);
      main_menu.clone().insertAfter(main_menu).hide();

      main_menu.wrap('<div class="molmenu"></div>');
      var molmenu = $('.molmenu');

      var main_menu_ul = molmenu.find('ul:first');
      var first_link_position = main_menu_ul.find('li:first').position();
      var third_link_position = main_menu_ul.find('li:nth-child(3)').position();
      var last_link = main_menu_ul.find('li:last');
      var last_link_position = last_link.position();
      var last_link_width = last_link.width();

      // on a page refresh, check if the last link wraps to the second line
      if ((first_link_position.top != last_link_position.top) && (first_link_position.top == third_link_position.top)) {
        convert_wrapping_lines_to_dropdown(main_menu_ul);
      }

      // build the dropdown
      menu_one_line_menu_dropdown_build();
    }

    // move the links that wrap to the second line under the 'MORE' button link
    function convert_wrapping_lines_to_dropdown(main_menu_ul) {
      var links = main_menu_ul.children('li');
      links.css('float', 'left');
      links.css('display', 'inline-block');

      var dropdown_html = '<li class="molmenu-dropdown   molmenu-dropdown-toggle"><a class="molmenu-dropdown-button">MORE</a><ul class="molmenu-dropdown-menu"></ul></li>';

      // get the first link position top
      var first_link_position_top = main_menu_ul.find('li:first').position().top;

      // dropdown has not been created yet
      var dropdown_initiated = false;
      var total_width_of_links_on_first_line = 0;

      // loop through all the links and get the links that are on the second line and  the immediate preceding link
      links.each(function() {
        var link_position_top = $(this).position().top;
        var current_link_width = $(this).outerWidth(true);
        total_width_of_links_on_first_line = total_width_of_links_on_first_line + current_link_width;

        // if the dropdown already exists, that means the current link must be moved under the "MORE" button
        if (dropdown_initiated) {
          var  dropdown_collapsible = $('.molmenu-dropdown-menu');
          dropdown_collapsible.append($(this));
        }
        // otherwise, continue checking if the current link is on the second line
        else {
          // yes the current link is on the second line
          if ((link_position_top >  first_link_position_top) ) {

            var last_link_on_first_line = $(this).prev();
            var first_link_on_second_line = $(this);

            // create the drowpdown in the main menu
            last_link_on_first_line.after(dropdown_html);

            // IMPORTANT STEP - add the link to the collapsible dropdown
            var dropdown_collapsible = $('.molmenu-dropdown-menu');
            dropdown_collapsible.append(first_link_on_second_line);

            dropdown_initiated = true;
          }
        }
      });

      // IMPORTANT STEP: when all the links on the second line have been moved under the "MORE" button,
      // check if the "MORE" button link has wrapped to the second line!!!
      check_more_button_on_second_line(main_menu_ul);
    }


    // check if "MORE" button has wrapped to the second line
    function check_more_button_on_second_line(main_menu_ul) {
      var more_button = $('.molmenu .molmenu-dropdown');
      var more_button_position_top = more_button.position().top;
      var first_link_position_top = main_menu_ul.find('li:first').position().top;

      // if the "MORE" button has wrapped to the second line,
      // move the last link on the first line to the "MORE" button link
      // until the "MORE" button link has moved to the first line
      while (more_button_position_top > first_link_position_top) {
        var dropdown_menu = $('.molmenu-dropdown-menu');
        var preceding_link = more_button.prev();

        // important step, move the last link on the first line to the MORE button
        dropdown_menu.prepend(preceding_link);

        // recalculate the top position of the MORE button
        more_button_position_top = more_button.position().top;
      }
    }

    function doneResizing() {
      menu_reset();
    }

    function menu_reset() {
      $('.molmenu').remove();
      $(menu_one_line_class).show();
      main_menu_check_for_two_lines();
    }

    // bind the click and hover event to the dropdown button
    function menu_one_line_menu_dropdown_build() {

      var dropdown_toggle = $('.molmenu-dropdown-toggle');
      var dropdown_menu = $('.molmenu-dropdown-menu');

      dropdown_menu.hide();

      dropdown_toggle.click(function(e) {
        dropdown_menu.toggle();
        dropdown_menu.css('right', 0);
        e.stopImmediatePropagation();
      });
      dropdown_toggle.mouseenter(function(e) {
        dropdown_menu.show();
        dropdown_menu.css('right', 0);
        e.stopImmediatePropagation();
      });
      dropdown_toggle.hover(function(e) {
        dropdown_menu.show();
      });
      dropdown_toggle.mouseleave(function(e) {
        dropdown_menu.show();
        e.stopImmediatePropagation();
        clearTimeout();
        setTimeout(menu_one_line_hide_dropdown_after_hover, 800);
      });
    }

    // when cursor does not hover over the MORE button link, hide it
    function menu_one_line_hide_dropdown_after_hover() {
      if ($('.molmenu-dropdown-toggle').is(':hover')) {
      }
      else {
        $('.molmenu-dropdown-menu').hide();
      }
    }

    // if user clicks anywhere else, hide the dropdown menu
    $(document).click(function (e) {
      var dropdown_menu = $('.molmenu-dropdown-menu');
      if(dropdown_menu.is(':visible') ) {
        dropdown_menu.fadeOut('fast');
      }
    });

  }
}

})(jQuery);