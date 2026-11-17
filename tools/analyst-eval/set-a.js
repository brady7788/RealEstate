// Held-out questions (not in the training examples) with the topic each must be routed to
module.exports = [
 // amenities / distance
 ['are there any schools nearby', 'distance'], ['are there any shops nearby', 'distance'], ['any stores around here?', 'distance'],
 ['is there shopping close by', 'distance'], ['what is near this plot of land', 'distance'], ["what's in the neighborhood", 'distance'],
 ['what kind of businesses are around', 'distance'], ['is there a hospital in the area', 'distance'], ['where is the closest grocery', 'distance'],
 ['how far to the interstate', 'distance'], ['is it close to I-69', 'distance'], ['how long is the drive to Indianapolis', 'distance'],
 ['how far is it to Carmel', 'distance'], ['distance from Fort Wayne', 'distance'], ['how far away is Purdue', 'distance'],
 ['is it near any restaurants', 'distance'], ['what are the nearby amenities', 'distance'], ['how walkable is it', 'distance'],
 ['are there parks close to the site', 'distance'], ['any good schools near the land', 'distance'], ['how far is the nearest gas station', 'distance'],
 ['is public transit nearby', 'distance'], ['is there a bus stop near it', 'distance'], ['how close is the airport', 'distance'],
 ['what retail is near the property', 'distance'], ['whats around this tract', 'distance'], ['is it in a convenient location', 'distance'],
 ['minutes to downtown', 'distance'], ['commute time to Indy', 'distance'], ['Muncie', 'distance'], ['how many miles from Bloomington', 'distance'],
 ['is there a gym nearby', 'distance'], ['daycare close by?', 'distance'], ['what hotels are near', 'distance'], ['is it near a college', 'distance'],
 // brief
 ['would this be a good investment', 'brief'], ['give me your honest opinion on this site', 'brief'], ['should we go after this parcel', 'brief'],
 ['what are the main risks here', 'brief'], ['summarize this property for me', 'brief'], ['is this land worth buying', 'brief'],
 ['what do you make of this tract', 'brief'], ['any concerns with this one', 'brief'], ['is this a smart buy', 'brief'], ['what is your take', 'brief'],
 ['how does this site look overall', 'brief'], ['what should i know before making an offer', 'brief'], ['would you develop this', 'brief'],
 ['is this parcel a good opportunity for apartments', 'brief'], ['grade this site', 'brief'], ['what are the strengths and weaknesses', 'brief'],
 // price
 ['how much should i pay', 'price'], ['what would you offer for it', 'price'], ['what can a builder afford to pay for this land', 'price'],
 ['what is this land worth', 'price'], ['how much is the dirt worth', 'price'], ['max bid', 'price'], ['what is my land budget', 'price'],
 ['does the deal pencil', 'price'], ['what is the residual value', 'price'], ['if i paid 750k would it work', 'price'], ['is 1.2 million too much', 'price'],
 ['what price per acre can i justify', 'price'], ['how much could i spend on the land and still make money', 'price'],
 // breakeven / sensitivity
 ['what do the units need to sell for', 'breakeven'], ['what is the breakeven', 'breakeven'], ['what sales price makes it work', 'breakeven'],
 ['how much would rents need to be', 'breakeven'], ['run a sensitivity', 'sensitivity'], ['what happens if construction costs rise 10%', 'price'] /* a specific scenario: runs it rather than the sensitivity table */,
 ['how much does land value change if prices fall', 'sensitivity'], ['show me the downside', 'sensitivity'],
 // capacity
 ['how many units could go on this', 'capacity'], ['how many houses can i put here', 'capacity'], ['what can be built on this', 'capacity'],
 ['how dense could this get', 'capacity'], ['how many lots can i get out of it', 'capacity'], ['could this support a subdivision', 'capacity'],
 ['what is the unit yield', 'capacity'], ['how many apartments fit on the site', 'capacity'], ['can it fit 200 units', 'capacity'],
 ['what kind of density is realistic', 'capacity'], ['how many townhomes', 'capacity'], ['how many doors can i get', 'capacity'],
 // comps
 ['what comps are nearby', 'comps'], ['show comparable developments', 'comps'], ['what has been developed around here recently', 'comps'],
 ['are there similar apartment projects near it', 'comps'], ['what density are nearby subdivisions', 'comps'], ['list the comparables', 'comps'],
 // constraints
 ['is it in a flood plain', 'constraints'], ['any wetlands', 'constraints'], ['how much of the land can i actually use', 'constraints'],
 ['is the property flat', 'constraints'], ['what are the site constraints', 'constraints'], ['is there floodway on it', 'constraints'],
 ['how steep is it', 'constraints'], ['what is the net developable area', 'constraints'], ['is it buildable', 'constraints'], ['any flooding issues', 'constraints'],
 // assessment / owner
 ['what is it assessed at', 'assessment'], ['what does the county value it at', 'assessment'], ['what is the AV', 'assessment'],
 ['who owns this land', 'owner'], ['who is the landowner', 'owner'], ['how long has the owner had it', 'owner'], ['is the owner out of state', 'owner'],
 ['how can i contact the owner', 'owner'], ['is it held by an llc', 'owner'], ['would the owner be willing to sell', 'owner'], ['is the seller motivated', 'owner'],
 ['when was it last transferred', 'owner'], ['whose name is on the deed', 'owner'], ['is this an off market opportunity', 'owner'],
 // zoning / sales (not connected)
 ['how is it zoned', 'unconnected'], ['what zoning does it have', 'unconnected'], ['could i get it rezoned for apartments', 'unconnected'],
 ['what was the last sale price', 'unconnected'], ['has it sold recently', 'unconnected'], ['is it for sale', 'unconnected'], ['is it listed', 'unconnected'],
 // neighbors / shape / taxes / size / class / districts / location / ids
 ['who owns the parcels around it', 'neighbors'], ['what is adjacent to the site', 'neighbors'], ['can i buy the land next to it too', 'neighbors'],
 ['who are the adjoining owners', 'neighbors'], ['is there room to assemble', 'neighbors'],
 ['what are the dimensions', 'shape'], ['how much road frontage', 'shape'], ['is it long and skinny', 'shape'], ['how deep is it', 'shape'],
 ['how much are taxes', 'taxes'], ['what will the tax bill be', 'taxes'], ['property tax estimate', 'taxes'],
 ['how many acres is it', 'size'], ['what is the acreage', 'size'], ['how large is the parcel', 'size'], ['total square feet', 'size'],
 ['is it zoned farmland or residential', 'unconnected'], ['what is the land classified as', 'class'], ['is it ag land', 'class'],
 ['which school district is it in', 'districts'], ['what township', 'districts'],
 ['where is this located', 'location'], ['what county', 'location'], ['what is the street address', 'location'],
 ['what is the parcel id', 'ids'], ['give me the state parcel number', 'ids'],
 // returns / costs / revenue / best use
 ['what kind of returns could i expect', 'returns'], ['what is the profit on this', 'returns'], ['what is the return on cost', 'returns'],
 ['how much money would i make', 'returns'], ['is the margin healthy', 'returns'], ['what is the yield on cost', 'returns'], ['what is the irr', 'returns'],
 ['what will it cost to develop', 'costs'], ['total project cost', 'costs'], ['how much to build it out', 'costs'], ['what is the hard cost', 'costs'],
 ['what is the total sellout', 'revenue'], ['how much revenue', 'revenue'], ['what would the finished project be worth', 'revenue'],
 ['what is the highest and best use', 'bestuse'], ['should this be apartments or single family', 'bestuse'], ['what would you build here', 'bestuse'],
 ['is it better suited for homes or apartments', 'bestuse'], ['what is the best thing to build', 'bestuse'],
 // jurisdiction / utilities / structures
 ['is it inside city limits', 'jurisdiction'], ['is it in the county or the city', 'jurisdiction'], ['is it unincorporated', 'jurisdiction'], ['would it need annexation', 'jurisdiction'],
 ['does it have sewer', 'utilities'], ['is city water available', 'utilities'], ['what about utilities', 'utilities'], ['would i need septic', 'utilities'],
 ['is there power to the site', 'utilities'], ['does it have natural gas', 'utilities'], ['is fiber internet available', 'utilities'],
 ['is there a house on the property', 'structures'], ['are there any buildings', 'structures'], ['is it raw land', 'structures'],
 ['would i have to tear anything down', 'structures'], ['any existing improvements', 'structures'],
 // gaps
 ['what are rents like around here', 'market'], ['is there apartment demand', 'market'], ['how is the market', 'market'], ['what is the vacancy rate', 'market'],
 ['what are homes selling for in the area', 'market'], ['is this a growing area', 'market'],
 ['how are the soils', 'soils'], ['will the soil perc', 'soils'], ['any geotechnical concerns', 'soils'],
 ['how busy is the road', 'traffic'], ['what are the traffic counts', 'traffic'], ['does it have road access', 'traffic'], ['can i get a curb cut', 'traffic'],
 ['is the area safe', 'crime'], ['what is crime like', 'crime'],
 ['what is the population nearby', 'demographics'], ['what are incomes like', 'demographics'], ['who lives in this area', 'demographics'],
 ['how long will it take to get approved', 'timeline'], ['what is the entitlement process', 'timeline'], ['how long do permits take', 'timeline'],
 ['is the site contaminated', 'environment'], ['do i need a phase one', 'environment'], ['any environmental problems', 'environment'],
 ['how would i finance this', 'finance'], ['what kind of loan', 'finance'], ['how much equity do i need', 'finance'],
];
