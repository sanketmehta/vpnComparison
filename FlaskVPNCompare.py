
from flask import Flask, render_template, jsonify, redirect

import sqlalchemy
from sqlalchemy.ext.automap import automap_base
from sqlalchemy.orm import Session
from sqlalchemy import create_engine, func


#################################################
# Flask Setup
#################################################
app = Flask(__name__)

#################################################
# sqlite connection
#################################################

engine = create_engine("sqlite:///data/vpnCompare.sqlite", echo=False)
Base = automap_base()
Base.prepare(engine, reflect=True)
vpnMaster = Base.classes.vpn_master
session = Session(engine)


#################################################
# Flask Routes
#################################################

# Default route to render index.html
@app.route("/")
def default():


    return render_template("index.html")

# Route to get the list of all VPNs
@app.route('/vpnNames', methods=['POST','GET'])
def vpnNames():

    vpnNames = session.query(vpnMaster.VPN_SERVICE).all()
    vpnNamesArr = []
    for x in vpnNames:
        # print(x[0])
        vpnNamesArr.append(x[0])

    return jsonify(vpnNamesArr)

# Route to get the metadata for a specific VPN
@app.route('/metadata/<sample>', methods=['POST','GET'])
def metadata(sample):

    results = session.query(vpnMaster).filter(vpnMaster.VPN_SERVICE == sample).all()

    dict1 = {}
    for k,v in results[0].__dict__.items():
        if(("$" in k) or ("#" in k)):
            if(("$" in k)):
                k = "Dollar" + k[1:]
            else:
                k = "Number" + k[1:]
        
        if(("_sa_instance_state" != k)):
            if('index' in k or 'Unnamed:_10' in k or 'index' in k):
                pass
            else:
                dict1[k] = v

    return jsonify(dict1)


# Route to get the all/defined columns data 
@app.route('/getColumns', methods=['POST','GET'])
def getColumns():

    results = session.query(vpnMaster).all()

    dict1 = {}
    availability, vpnServiceProvider, noOfCountries, noOfServers = [], [], [], []
    for x in results:
        y = x.__dict__
        for k,v in y.items():
            if("VPN_SERVICE" in k):
                vpnServiceProvider.append(v)
            if("Availability" in k):
                availability.append(v)
            if("#_of_Countries" in k):
                noOfCountries.append(v)
            if("#_of_Servers" in k):
                noOfServers.append(v)

    dict1['VPN_SERVICE'] = vpnServiceProvider
    dict1['Availability'] = availability
    dict1['Number_of_Countries'] = noOfCountries
    dict1['Number_of_Servers'] = noOfServers
    
    return jsonify(dict1)





# Initiate the Flask app
if __name__ == '__main__':
    app.run(debug=True)
