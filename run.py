#!/usr/bin/env python

import sys

from app import app

#import the app variable from our app package
#invoke its run method to start server
#app.run( debug=True )



if ( "-d" in sys.argv ): app.run( debug=True, extra_files=["tests/plotly/javascript_test.html"] )
else: app.run( debug=False )




