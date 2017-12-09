
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
    # Default route to render index.html

@app.route("/d3bubble")
def bubble():

    return render_template("d3bubble.html")


# Route to render simpleComparison html page
@app.route("/simpleComparison")
def default1():

    return render_template("dataTables.html")

# Default route to charts html page
@app.route("/charts")
def default2():

    return render_template("chartJS.html")

# Route to get the list of all VPNs
@app.route('/vpnNames', methods=['POST','GET'])
def vpnNames():

    vpnNames = session.query(vpnMaster.VPN_SERVICE).all()
    vpnNamesArr = []
    for x in vpnNames:
        vpnNamesArr.append(x[0])

    return jsonify(vpnNamesArr)

# Route to get simpleComparison Data
@app.route('/simpleCompareData', methods=['POST','GET'])
def simpleCompareData():

    allData = session.query(vpnMaster).all()
    list1 = []
    for x in allData:
        dict2 = {}
        for k,v in x.__dict__.items():
            if(("_sa_instance_state" != k)):
                if('index' in k or 'Unnamed:_10' in k or 'index' in k):
                    pass
                elif('Jurisdiction' in k or 'VPN_SERVICE' in k or 'Logging' == k or 'Activism' in k or 'Service_Config' in k or 'Security' in k or 'Availability' in k or 'Website' in k or 'Pricing' == k or 'Ethics' in k):
                    dict2[k] = v
                    
        list1.append(dict2)

    return jsonify(list1)


# Route to get the metadata for a specific VPN
@app.route('/vpnData/<vpnName>', methods=['POST','GET'])
def vpnData(vpnName):

    results = session.query(vpnMaster).filter(vpnMaster.VPN_SERVICE == vpnName).all()

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
    colList = []
    
    for k,v in results[0].__dict__.items():
        if(("_sa_instance_state" != k)):
            colList.append(k)
 
    for i in colList:
        dict1[i] = []

    for x in results:
        y = x.__dict__
        for k,v in y.items():
            if(("_sa_instance_state" != k)):
                dict1[k].append(v)
    
    
    return jsonify(dict1)


@app.route("/countryMap")
def country():

    return render_template("countryMap.html")


# Initiate the Flask app
if __name__ == '__main__':
    app.run(debug=True)
