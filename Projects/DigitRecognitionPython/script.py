import tensorflow as tf
from tensorflow import keras
from keras.models import Sequential
from keras.layers import Dense
print()

#XOR GATE
#Config: [2, 3, 1]
model = Sequential()
model.add(Dense(3, input_dim=2, activation='sigmoid'))
model.add(Dense(1, 'sigmoid'))

#Compile (optimizer, loss function)
model.compile(
    optimizer=keras.optimizers.RMSprop(learning_rate=0.1),
    loss=keras.losses.MeanSquaredError(),
    metrics=[keras.metrics.SparseCategoricalAccuracy()],
)

#Data
import numpy as np

#Create 2D arrays of inputs and outputs
xorDataInputs = np.array([
    [0, 0],
    [0, 1],
    [1, 0],
    [1, 1]
])
xorDataOutputs = np.array([
    [0],
    [1],
    [1],
    [0]
])

#Train Model
model.fit(xorDataInputs, xorDataOutputs, epochs=150, batch_size=4)

#Test
accuracy = model.evaluate(xorDataInputs, xorDataOutputs)
print(accuracy)

prediction = np.array([
    [0, 1]
])
prediction = model.predict(prediction)
print(prediction)
