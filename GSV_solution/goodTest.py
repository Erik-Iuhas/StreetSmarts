# Import google_streetview for the api module
import google_streetview.api
import requests
import json
import os
import math

# Classes=======================================================================
class LatLong:
    def __init__(self, lat, long):
    	self.lat = lat
    	self.long = long

# Functions======================================================================
    
# cuts a line bewteen 2 points into small sections
def getMidPoint(latLong1, latLong2, num):
    points = []
    for x in range(num):
        la = (latLong1.lat - latLong2.lat) * ((x + 1) / (num + 1))
        lo = (latLong1.long - latLong2.long) * ((x + 1) / (num + 1))
        points.append(LatLong(latLong1.lat - la,latLong1.long - lo))
    
    return points

#Takes 2 points and gets images of the sides of the road at mids number of intervals
def getMidImages(point1, point2, mids, count):

    # Find the mid point
    midPoint = getMidPoint(point1,point2,mids)
    
    #find the angle of the road, TEMP FEATURE IN DEV
    angle = math.degrees(math.atan((point2.lat - point1.lat)/(point2.long - point1.long)))
    angle = 90 - angle

    #create the url
    url = "https://roads.googleapis.com/v1/snapToRoads?path="
    for x in range(mids):
        url = url + str(midPoint[x].lat) + "%2C" + str(midPoint[x].long) + "%7C"
    
    url = url[:-len("%7C")] 
    print(url)
    url = url + "&key=INSERT KEY HERE"
    
    
    #then snap the midpoint 
    payload={}
    headers = {}

    pointsJSON = requests.request("GET", url, headers=headers, data=payload)
    
    # get the point lat and long
    pointsJSONText = json.loads(pointsJSON.text)
    snapMidPoint = pointsJSONText["snappedPoints"]
    
    #go through each midPoint
    local = []
    for x in snapMidPoint:
        local.append(str(x["location"]["latitude"]) + ',' + str(x["location"]["longitude"]))
    #------------------------------------------------


    # Define parameters for each point with street view api
    for x in local:
        #LEFT IMAGE
        params = [{
            'size': '640x300', # max 640x640 pixels
            'location': x,
            'heading': str(angle - 90),
            'pitch': '-10',
            'fov': '120',
            'key': 'AIzaSyDHRoNWzJ8Ewb2UxoIYkKcU5ulV7owCDa8'
        }]
        # Create a results object
        #api_list = google_streetview.helpers.api_list()
        resultsLeft = google_streetview.api.results(params)
        # Download images to directory
        resultsLeft.download_links(r"C:\Users\Fruit\OneDrive\Documents\plzImage\pitch10")
        newName = "pitch10\gsv_" + str(count) + "_left_" + x + ".jpg"
        os.rename("pitch10\gsv_0.jpg", newName)
        
        #RIGHT IMAGE
        params[0]["heading"] = str(angle + 90)
        # Create a results object
        #api_list = google_streetview.helpers.api_list()
        resultsRight = google_streetview.api.results(params)
        # Download images to directory
        resultsRight.download_links(r"C:\Users\Fruit\OneDrive\Documents\plzImage\pitch10")
        newName = "pitch10\gsv_" + str(count) + "_right_" + x + ".jpg"
        os.rename("pitch10\gsv_0.jpg", newName)

# First get 2 real map points
#point1 = LatLong(45.28344683472164, -75.7365803274572)
#point2 = LatLong(45.28443699061171, -75.73399335399235)

points = []

#mid town
# points.append(LatLong(45.41231382506887, -75.70158133465998))
# points.append(LatLong(45.41294078941978, -75.70008855415975))
# points.append(LatLong(45.41382748426193, -75.69797697148636))
# points.append(LatLong(45.41318943568384, -75.69741993337962))
# points.append(LatLong(45.41231953771878, -75.69952278516762))
# points.append(LatLong(45.41167934451038, -75.69898634338496))
# points.append(LatLong(45.4125341891112, -75.69691031368609))
# points.append(LatLong(45.41189399833596, -75.69633095656083))
# points.append(LatLong(45.411012782686704, -75.6984016218612))
# points.append(LatLong(45.41037634061662, -75.69790273100332))
# points.append(LatLong(45.409762487318226, -75.69943695450577))
# points.append(LatLong(45.41036880870435, -75.69996266745278))
# points.append(LatLong(45.41105044174554, -75.70052056690673))
# points.append(LatLong(45.41168311035618, -75.70108383077851))

# points.append(LatLong(45.40035604278422, -75.72100386993728))
# points.append(LatLong(45.40004341256814, -75.72193191422002))
# points.append(LatLong(45.401116894636274, -75.72261319528309))
# points.append(LatLong(45.400849467677816, -75.72351978189457))
# points.append(LatLong(45.40338055664211, -75.72505936987861))
# points.append(LatLong(45.40280805834988, -75.72567627797878))
# points.append(LatLong(45.40062723867947, -75.72431908025744))
# points.append(LatLong(45.4003183765713, -75.72526858221927))
# points.append(LatLong(45.400073545647345, -75.72611616025809))
# points.append(LatLong(45.39950101384341, -75.72579429518893))
# points.append(LatLong(45.39885314189696, -75.727929333532))
# points.append(LatLong(45.398303198264514, -75.72763429055193))
# points.append(LatLong(45.39903394411384, -75.72553143876672))

# points.append(LatLong(45.43899449988703, -75.65900091631353))
# points.append(LatLong(45.43888157851419, -75.66094819998456))
# points.append(LatLong(45.4388326458491, -75.66174213382287))
# points.append(LatLong(45.43948758723393, -75.6618279645081))
# points.append(LatLong(45.439528991318866, -75.66102866625195))
# points.append(LatLong(45.439664495384385, -75.6590974758344))
# points.append(LatLong(45.44028555152091, -75.65916721326616))
# points.append(LatLong(45.44016134084048, -75.66113059019065))
# points.append(LatLong(45.44079368327513, -75.6612003276224))
# points.append(LatLong(45.44091789256347, -75.65926913720486))
# points.append(LatLong(45.44152011553905, -75.65934960347225))
# points.append(LatLong(45.44141472698235, -75.66128615830762))
# points.append(LatLong(45.4412453521038, -75.66351775612345))
# points.append(LatLong(45.4413657965141, -75.6637698837613))
# points.append(LatLong(45.440984814608676, -75.66430382451368))
# points.append(LatLong(45.441835451680035, -75.66662125301474))
# points.append(LatLong(45.4425468153328, -75.66855780791153))
# points.append(LatLong(45.44317160352806, -75.66811256124677))
# points.append(LatLong(45.44371734658949, -75.66956631851802))
# points.append(LatLong(45.44402973505932, -75.67043535420592))
# points.append(LatLong(45.443303335115786, -75.67059092240423))
# points.append(LatLong(45.44304739922097, -75.67073576169328))
# points.append(LatLong(45.443254406280275, -75.67216269683513))
# points.append(LatLong(45.44360443467068, -75.67217879008861))


#downtown
# points.append(LatLong(45.418384846560556, -75.69349458771529))
# points.append(LatLong(45.41898327887658, -75.69404491992044))
# points.append(LatLong(45.419597536139015, -75.69455465384816))
# points.append(LatLong(45.42021178671905, -75.69511851881244))
# points.append(LatLong(45.42106349429064, -75.6929713210421))
# points.append(LatLong(45.42198167760882, -75.6937607319921))
# points.append(LatLong(45.42255474307701, -75.6942434004015))
# points.append(LatLong(45.42325444499088, -75.69485237460627))
# points.append(LatLong(45.424014292424516, -75.69663418791693))
# points.append(LatLong(45.42347606821399, -75.69793784380546))
# points.append(LatLong(45.42264022750526, -75.69990009393122))
# points.append(LatLong(45.42179804214938, -75.70186685499756))
# points.append(LatLong(45.42256740745051, -75.70252544934092))
# points.append(LatLong(45.421680895064775, -75.70461851614344))

# points.append(LatLong(45.415852889316604, -75.6996321102374))
# points.append(LatLong(45.41673688917199, -75.69750790915296))
# points.append(LatLong(45.41756229823024, -75.69549750455516))
# points.append(LatLong(45.4181693655793, -75.69602096839384))
# points.append(LatLong(45.41737059139565, -75.69806930515385))
# points.append(LatLong(45.41643867390008, -75.70020109267075))
# points.append(LatLong(45.41706705424312, -75.70071697007698))
# points.append(LatLong(45.41795636023515, -75.69856242326274))
# points.append(LatLong(45.41877642640177, -75.69652925936762))
# points.append(LatLong(45.419367505668205, -75.69706030963873))
# points.append(LatLong(45.41854744808622, -75.69907830066897))
# points.append(LatLong(45.41767945208652, -75.70117974245609))
# points.append(LatLong(45.418467571711155, -75.70190045353831))
# points.append(LatLong(45.41845692151929, -75.70192321283565))
# points.append(LatLong(45.41935153063425, -75.6997155609943))
# points.append(LatLong(45.420219500930386, -75.69782653931563))
# points.append(LatLong(45.41938348069764, -75.69704513677384))
# points.append(LatLong(45.42022482586036, -75.69508783720316))

#suberbs
# points.append(LatLong(45.27831849945624, -75.72748409125988))
# points.append(LatLong(45.27974156077102, -75.72864280550887))
# points.append(LatLong(45.28008505298253, -75.72768793913701))
# points.append(LatLong(45.27937541843174, -75.72706030225216))
# points.append(LatLong(45.27967739166582, -75.72627709725052))
# points.append(LatLong(45.280409670084374, -75.72681353903245))
# points.append(LatLong(45.280726736158336, -75.72601424077737))
# points.append(LatLong(45.280451190742504, -75.72568701129039))
# points.append(LatLong(45.28128159755919, -75.72354660850739))
# points.append(LatLong(45.282293167581486, -75.724211796317))
# points.append(LatLong(45.28198365927592, -75.72512911177591))
# points.append(LatLong(45.28128159756932, -75.7270012935949))
# points.append(LatLong(45.28236110822454, -75.72775231213866))
# points.append(LatLong(45.283429275114294, -75.72760210843973))
# points.append(LatLong(45.283478342390474, -75.72897539946169))
# points.append(LatLong(45.28462197482354, -75.72927580685958))
# points.append(LatLong(45.28530134953705, -75.7296620449636))
# points.append(LatLong(45.28535041518161, -75.73090122552532))

# points.append(LatLong(45.28246677134678, -75.71373083864479))
# points.append(LatLong(45.28204146204288, -75.71170994661013))
# points.append(LatLong(45.28105752531386, -75.70821849474666))
# points.append(LatLong(45.280270363644576, -75.70864252120036))
# points.append(LatLong(45.28098769689751, -75.71088895922104))
# points.append(LatLong(45.28035923728317, -75.71116863624371))
# points.append(LatLong(45.27962919969847, -75.70912067869071))
# points.append(LatLong(45.279095948917664, -75.70958981434161))
# points.append(LatLong(45.27852609123061, -75.71003431647087))
# points.append(LatLong(45.27879767133688, -75.71086204412003))
# points.append(LatLong(45.27824270867821, -75.71131398733662))
# points.append(LatLong(45.27873873664995, -75.71295349415398))
# points.append(LatLong(45.27936269329317, -75.71273021503553))
# points.append(LatLong(45.27999113189374, -75.71247822858203))
# points.append(LatLong(45.28069362823774, -75.71221667301077))
# points.append(LatLong(45.28132794588194, -75.71186994182372))
# points.append(LatLong(45.28206409061652, -75.71172321552714))
# points.append(LatLong(45.28273738536475, -75.71141062471276))
# points.append(LatLong(45.283462290451105, -75.71057173310751))
# points.append(LatLong(45.28382361738135, -75.71079501224217))
# points.append(LatLong(45.28411312611822, -75.71100872227105))

# NEW STUFF ====================================================

#suberbs
# points.append(LatLong(45.4729640467543, -75.48850726195471))
# points.append(LatLong(45.47237353771558, -75.48813725653137))
# points.append(LatLong(45.472856681934736, -75.48681034053051))
# points.append(LatLong(45.47232880193022, -75.48627447060709))
# points.append(LatLong(45.47129092174165, -75.48788208037737))
# points.append(LatLong(45.47081671150117, -75.48709103429992))
# points.append(LatLong(45.472078280876005, -75.48330166841284))
# points.append(LatLong(45.47209617527395, -75.48231924021987))
# points.append(LatLong(45.47284773485719, -75.48248510471997))
# points.append(LatLong(45.472615110342886, -75.48525376599103))
# points.append(LatLong(45.473259298953444, -75.48575135949136))
# points.append(LatLong(45.473572443534984, -75.4827530396817))
# points.append(LatLong(45.47431503658703, -75.4829571806049))
# points.append(LatLong(45.47455660094247, -75.48142612354295))
# points.append(LatLong(45.47527234095279, -75.47906574411832))
# points.append(LatLong(45.47451186689002, -75.4787595327335))
# points.append(LatLong(45.47416294006199, -75.47970368450335))
# points.append(LatLong(45.472946152682134, -75.48007368992667))
# points.append(LatLong(45.472579321892404, -75.47930816148755))
# points.append(LatLong(45.47129986906483, -75.48077542442613))
# points.append(LatLong(45.471523551720146, -75.48231924015792))
# points.append(LatLong(45.47021723246678, -75.48595550035262))
# points.append(LatLong(45.46951932345768, -75.48545790686615))
# points.append(LatLong(45.470351444731406, -75.48229372255638))
# points.append(LatLong(45.47133565833622, -75.48104335940171))
# points.append(LatLong(45.47155934084949, -75.48226820494097))
# points.append(LatLong(45.47284773484259, -75.48252338109499))
# points.append(LatLong(45.474323983416994, -75.48302097459532))

#midtown
# points.append(LatLong(45.40166704667101, -75.68757005610763))
# points.append(LatLong(45.40337734261927, -75.68346511916766))
# points.append(LatLong(45.40396643256877, -75.68399740769395))
# points.append(LatLong(45.40238917794225, -75.68799408256078))
# points.append(LatLong(45.40306062505359, -75.68838202165621))
# points.append(LatLong(45.40461252415993, -75.68452969622024))
# points.append(LatLong(45.40522693773997, -75.68503491922823))
# points.append(LatLong(45.40373206418487, -75.68879702626992))
# points.append(LatLong(45.40439716111724, -75.68919398720477))
# points.append(LatLong(45.40587934896839, -75.68558525143337))
# points.append(LatLong(45.40655708859825, -75.68615362734927))
# points.append(LatLong(45.405176264730194, -75.68962703552924))
# points.append(LatLong(45.40694345990604, -75.69056530692046))
# points.append(LatLong(45.408222900024064, -75.68746179415704))
# points.append(LatLong(45.40763385446057, -75.68692048379135))
# points.append(LatLong(45.408482584860856, -75.68493567896913))
# points.append(LatLong(45.40906528787815, -75.68541383645884))
# points.append(LatLong(45.40991399673616, -75.68331174787198))
# points.append(LatLong(45.410256010133544, -75.68376283984341))
# points.append(LatLong(45.40942630738379, -75.68572057899941))
# points.append(LatLong(45.41004066860629, -75.68630699856227))
# points.append(LatLong(45.4092362974053, -75.68822865036054))
# points.append(LatLong(45.40803288602486, -75.69125096668661))
# points.append(LatLong(45.40661409440377, -75.69046606678197))
# points.append(LatLong(45.40529027901834, -75.69360566693496))
# points.append(LatLong(45.40591101926104, -75.6941740429155))
# points.append(LatLong(45.40458718739451, -75.69748505810081))
# points.append(LatLong(45.40315564051627, -75.70086824794139))
# points.append(LatLong(45.4024588567937, -75.70049835252482))
# points.append(LatLong(45.40395376403888, -75.69688059491398))
# points.append(LatLong(45.40325065581261, -75.69635732822712))
# points.append(LatLong(45.401743060906114, -75.70005628242923))
# points.append(LatLong(45.40124263186304, -75.70132836178867))
# points.append(LatLong(45.40204711689414, -75.70183358479667))

#downtown
# points.append(LatLong(45.41304978594912, -75.69149473975088))
# points.append(LatLong(45.414690048885554, -75.68756496770587))
# points.append(LatLong(45.416607178946144, -75.68923398286012))
# points.append(LatLong(45.41578708127501, -75.69122162818019))
# points.append(LatLong(45.41490306655081, -75.69323961923033))
# points.append(LatLong(45.41561666987478, -75.6937403237766))
# points.append(LatLong(45.416394167709036, -75.69178302418662))
# points.append(LatLong(45.41719295570502, -75.68979537886656))
# points.append(LatLong(45.4178745791931, -75.6903264291429))
# points.append(LatLong(45.41702254854737, -75.69235959305809))
# points.append(LatLong(45.41627701118615, -75.69430171978303))
# points.append(LatLong(45.4169266942952, -75.69489346151954))
# points.append(LatLong(45.41773612508799, -75.69295133479459))
# points.append(LatLong(45.418556194453146, -75.69090299801437))
# points.append(LatLong(45.419205851339335, -75.69147956688585))
# points.append(LatLong(45.41836449099288, -75.69349755793598))
# points.append(LatLong(45.41758702028746, -75.69542451179589))
# points.append(LatLong(45.418162136634315, -75.6960162535324))
# points.append(LatLong(45.418396441614796, -75.69352790366605))
# points.append(LatLong(45.41922715143854, -75.69140370256065))
# points.append(LatLong(45.419919400289125, -75.69199544429716))
# points.append(LatLong(45.41901415008472, -75.69404378107738))
# points.append(LatLong(45.41820473761217, -75.69597073493729))
# points.append(LatLong(45.41737401274654, -75.69800389885246))
# points.append(LatLong(45.416734985302696, -75.69748802144115))
# points.append(LatLong(45.415850985417514, -75.69968808687175))
# points.append(LatLong(45.41519063912433, -75.69909634513525))
# points.append(LatLong(45.41605334805839, -75.69692662543473))
# points.append(LatLong(45.41477525604809, -75.69580383342185))
# points.append(LatLong(45.41388057442944, -75.69794320739231))
# points.append(LatLong(45.41320955391374, -75.697427329981))
# points.append(LatLong(45.41410424616294, -75.6952272645504))
# points.append(LatLong(45.41342257716347, -75.69469621427403))
# points.append(LatLong(45.412549176733194, -75.69686593397456))
# points.append(LatLong(45.411867488963466, -75.69636522942828))
# points.append(LatLong(45.412804807525546, -75.69413481826761))

#More ones for Erik ================================================


points.append(LatLong(43.76446984584581, -79.43868748261129))
points.append(LatLong(43.76507798487599, -79.43614210047964))
points.append(LatLong(43.76533598139386, -79.434917254862))
points.append(LatLong(43.764446810164166, -79.43451535242018))
points.append(LatLong(43.765363623813215, -79.43047718969561))
points.append(LatLong(43.76624817441536, -79.43083443631058))
points.append(LatLong(43.76728163827721, -79.42613730319009))
points.append(LatLong(43.76800122380122, -79.42298803942565))
points.append(LatLong(43.768882597125796, -79.41903162834214))
points.append(LatLong(43.76801583127235, -79.41868732541884))
points.append(LatLong(43.76712712740848, -79.42261592069403))
points.append(LatLong(43.76641820683252, -79.42570186317403))
points.append(LatLong(43.76536628124308, -79.43047819472658))




for x in range(len(points)):
    if(x == len(points) - 1):
        z = 7
        #getMidImages(points[x], points[0], 3, x)
    else:
        getMidImages(points[x], points[x+1], 5, x)

#getMidImages(point1, point2, 3)
