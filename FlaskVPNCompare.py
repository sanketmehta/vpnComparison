
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

engine = create_engine('mysql://p8j4q9u7itbc9epz:zlyrdub556dhg5hz@ffn96u87j5ogvehy.cbetxkdyhwsb.us-east-1.rds.amazonaws.com:3306/ml0vnaijudbhqrn0')

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
                    dict2[k] = v.strip()
                    
        list1.append(dict2)

    return jsonify(list1)



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

# Route to get the all columns By VPN 
@app.route('/getColumnsByVPN', methods=['POST','GET'])
def getColumnsbyVPN():
    results = session.query(vpnMaster).all()

    collist = []
    for x in results:
        r = {}
        for k,v in x.__dict__.items():
            if(("_sa_instance_state" != k)):
                r[k] = v
        collist.append(r)

    return jsonify(collist)




# Initiate the Flask app
if __name__ == '__main__':
    app.run(debug=True)
