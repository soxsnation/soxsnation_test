// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Progress

alia.defineControl({
    name: 'progress'
}, function () {

    var styles = {
        'success': 'progress-bar-success',
        'info': 'progress-bar-info',
        'warning': 'progress-bar-warning',
        'danger': 'progress-bar-danger'
    }

    return function (options) {

        // Determine class
        var cls = ['progress-bar'];
        var rating = '';
        if (typeof options.rating === 'boolean' && options.rating === true) {
            rating = 'progress-rating';
        }
        if (typeof options.style === 'string' && styles.hasOwnProperty(options.style)) {
            cls.push(styles[options.style]);
        }

        var html = [
            '<div class="progress :rating">',
            '  <div class=":class :rating" role="progressbar" aria-valuenow=":now" aria-valuemin="0" aria-valuemax="100" style="width::now%">:now%</div>',
            '</div>'
        ];

        var elm = this.append(html.join(''), {
            now: options.now,
            rating: rating,
            class: cls.join(' ')
        });

        // Return component
        return elm;
    };
}());