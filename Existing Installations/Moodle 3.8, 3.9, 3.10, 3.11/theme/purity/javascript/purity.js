(function($) {
  $(document).ready(function() {

    // Responsive Tabs
    $('.nav-tabs').responsiveTabs();

    // Form control
    var $input = $('.form-control');

    function init($this) {
      $this.on('focus blur', function(e) {
          $(this).parents('.form-group').toggleClass('focused', (e.type === 'focus'));
      }).trigger('blur');
    }
	
    if ($input.length) {
      init($input);
    }

    // Header Wrapper Height
    function setNavDrawerTop() {
      var headerWrapper = $('.header-wrapper');
      var navDrawer = $('#nav-drawer');

      if ( $(window).width() < 768 && $(headerWrapper).length ) {
        var headerWrapperHeight = headerWrapper.height();
        navDrawer.css({'top': `${ headerWrapperHeight }px`});
      } else if ( $(window).width() > 767 ) {
        navDrawer.css({'top': '0'});
      }
    }

    setNavDrawerTop();

    $(window).resize(function() {
      setNavDrawerTop();
    });

    // Course section completed
    function setCourseSectionStatus() {
      var courseSections = $('.course-content .purity-collapsible.show-completion-icons > li');

      if (courseSections.length) {
        courseSections.each(function(index, item) {
          var sectionStatus = 1 // Completed
          var cardHeader = $(item).find('.card-header');
          var innerSections = $(item).find('.content ul.section > li');

          var completedIcon = '<span class="purity-completion-icon section-completed"><span class="fa fa-check-circle" aria-hidden="true"></span></span>';
          var notCompletedIcon = '<span class="purity-completion-icon section-not-completed"><span class="fa fa-times-circle" aria-hidden="true"></span></span>';

          if (innerSections.length) {
            innerSections.each(function(index, item) {
              var isNewRendering = $(item).find('.activity-information').length;

              if (isNewRendering) {
                var innerSectionStatusManualElement = $(item).find('.activity-information .btn');
                var innerSectionStatusAutoElement = $(item).find('.activity-information .badge-secondary');

                if (innerSectionStatusManualElement.length || innerSectionStatusAutoElement.length) {
                  if (innerSectionStatusManualElement.length && innerSectionStatusManualElement.attr('data-toggletype')) {
                    var innerSectionManualStatus = innerSectionStatusManualElement.attr('data-toggletype').toLowerCase().indexOf('manual:mark-done');
                  }
  
                  if (innerSectionStatusAutoElement.length || innerSectionManualStatus >= 0) {
                    sectionStatus = 0 // Not completed
                  }
                }
              } else {
                var innerSectionStatusElement = $(item).find('.actions img.icon');
                if (innerSectionStatusElement.length) {
                  var innerSectionAutoStatus = innerSectionStatusElement.attr('src').toLowerCase().indexOf('completion-auto-n');
                  var innerSectionManualStatus = innerSectionStatusElement.attr('src').toLowerCase().indexOf('completion-manual-n');
                  
  
                  if (innerSectionAutoStatus >= 0 || innerSectionManualStatus >= 0) {
                    sectionStatus = 0 // Not completed
                  }
                }
              }
            });
          }

          if (sectionStatus === 1) {
            $(cardHeader).append(completedIcon);
          } else {
            $(cardHeader).append(notCompletedIcon);
          }
        });
      }
    }

    function observeCourseSection() {
      var courseSectionsObserve = document.querySelector('.course-content .purity-collapsible');

      if (courseSectionsObserve) {
        var observer = new MutationObserver(function(mutations) {

          if (mutations[0].type === 'attributes' && ((mutations[0].target.tagName.toLowerCase() === 'img' && mutations[0].target.classList.contains("icon"))) || mutations[0].target.tagName.toLowerCase() === 'button') {
            var completionIcons = $('.purity-completion-icon');

            if (completionIcons.length) {
              completionIcons.each(function(index, item) {
                item.remove();
              });
            }

            setCourseSectionStatus();
          }
        });
    
        observer.observe(courseSectionsObserve, {
          subtree: true,
          attributes: true
        });
      }
    }

    function initCourseSectionStatus() {
      var realLoggedIn = $('body.real-loggedin').length;
      var userEnrolled = $('body.user-enrolled').length;
      var isCoursePage = $('body.path-course-view').length;
      var isEditing = $('body.editing').length;

      if (realLoggedIn && userEnrolled && isCoursePage && !isEditing) {
        setCourseSectionStatus();
        observeCourseSection();
      }
    }

    initCourseSectionStatus();

  });
})(jQuery);