AWFramework = {
    DIRTY_MARKED : 1,
    DIRTY_SELECTED : 2,
    DIRTY_NEW_RECORDS : 4, 		
    DIRTY_RECORDS_PER_PAGE : 8, // Future
    DIRTY_CURRENT_PAGE : 16,   // if needed
    DIRTY_CLEARED : 32,

    isMobile : function(){
    	return ( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) )
    },

    checkEnvironment : function() {
        var envs = ['small', 'med', 'large'];

        $el = $('<div>');
        $el.appendTo($('body'));

        for (var i = envs.length - 1; i >= 0; i--) {
            var env = envs[i];

            $el.addClass('hide-on-' +env + '-only');
            if ($el.is(':hidden')) {
                $el.remove();
                return env
            }
        };
    }   
}