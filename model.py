import pickle
import warnings
import numpy as np
warnings.filterwarnings("ignore")

with open('knn_tier.pkl' , 'rb') as f:
    lr = pickle.load(f)

print(lr.predict(np.array([5,1,423, 100]).reshape(1, -1)))
#time active, has domain, subs, video count

