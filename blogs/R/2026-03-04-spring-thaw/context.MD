

#  CONTEXT
- ground temperature and air temperature
- series is co-integrated (VECM) where air temp affects ground temp (one way causality)
- missing data
  - only missing in ground temp (due to faulty data logging)
  - data loggers vary in faultiness (some have all, others have just a few)
- data loggers vary in soil composition which means there is variance across locations.
    - ground temp may respond differently across sensors to the same change in air temperature


- the model:
 - co-integrated VECM
 - partially-pooled allowing better sensor data to inform data gaps 
  - random effects by sensor location to account for soil composition differences

- outcomes:
  - properly model relationship of air temp and ground temp
  - account for missing data (with uncertainty around the imputed values) given known:
    - (1) relationship of ground temp and air temp, and
    - (2) uncertainty around random effects

- A good simulation will show:
  - 5 sensors with varying random effects in the sensitivity to air temp
  - varying faultiness in data loggers (a few sensors with really good data, others with terrible data)
  - Air temp is always good, only ground temp logs can be faulty
  - properly simulates a co-integrated relationship (VECM model)
  - This should have one good faceted plot that shows the time series with missing data across the 5 sensors
  
- run stan model


- prep stan data 


- plots

- export to public/blogs/..