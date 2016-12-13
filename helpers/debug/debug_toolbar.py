# from django.http import HttpResponse
# import json  

# class NonHtmlDebugToolbarMiddleware(object):
    # """
    # The Django Debug Toolbar usually only works for views that return HTML.
    # This middleware wraps any non-HTML response in HTML if the request
    # has a 'debug' query parameter (e.g. http://localhost/foo?debug)
    # Special handling for json (pretty printing) and
    # binary data (only show data length)
    # """

    # @staticmethod
    # def process_response(request, response):
        # if request.GET.get('debug') == '':
            # if response['Content-Type'] == 'application/octet-stream':
                # new_content = '<html><body>Binary Data, ' \
                    # 'Length: {}</body></html>'.format(len(response.content))
                # response = HttpResponse(new_content)
            # elif response['Content-Type'] != 'text/html':
                # content = response.content
                # try:
                    # json_ = json.loads(content)
                    # content = json.dumps(json_, sort_keys=True, indent=2)
                # except ValueError:
                    # pass
                # response = HttpResponse('<html><body><pre>{}'
                                        # '</pre><b>hello</b></body></html>'.format(content))

        # return response

from django.conf import settings


class JsonAsHTML(object):
    '''
    View a JSON response in your browser as HTML
    Useful for viewing stats using Django Debug Toolbar 

    This middleware should be place AFTER Django Debug Toolbar middleware   
    '''

    def process_response(self, request, response):

        #not for production or production like environment 
        if not settings.DEBUG:
            return response

        #do nothing for actual ajax requests
        if request.is_ajax():
            return response

        #only do something if this is a json response
        if "application/json" in response['Content-Type'].lower():
            title = "JSON as HTML Middleware for: %s" % request.get_full_path()
            response.content = "<html><head><title>%s</title></head><body>%s</body></html>" % (title, response.content)
            response['Content-Type'] = 'text/html'
        return response