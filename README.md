# Clustering Visualizer

![Next.js](https://img.shields.io/badge/-NEXT.JS-000000?logo=next.js&logoColor=white&style=for-the-badge)
![Redux](https://img.shields.io/badge/-Redux-764ABC?logo=redux&logoColor=white&style=for-the-badge)
![Typescript](https://img.shields.io/badge/-typescript-3178C6?logo=typescript&logoColor=white&style=for-the-badge)
![Vercel](https://img.shields.io/badge/-Vercel-000000?logo=vercel&logoColor=white&style=for-the-badge)

Revamp of a project I made during my college days! The one I created during my college days was an **Express** app, not deployed anywhere and was a total spaghetti code in my opinion :p. 

## Run locally
**Install dependencies:** `npm install`

**Run development server:** `npm run dev`

### Algorithms:

<details>
<summary>K Means</summary>

1. Maintain **current-clusters** and **previous-clusters**
2. (**Cluster Assigment**) For each data point
    - Find closest centroid using Euclidean distance
    - Update in current-cluster
    - Redraw
    - Increment data index
3. Reset parameters after assigning each data to a centroid/cluster
4. (**Update Centroid Location**) For each centroid
    - Find center coordinates of the centroid's cluster
        - Move centroid towards the center of cluster in small increments
        - Redraw
    - Increment centroid index after centroid has reached the center
5. Compare **previous-clusters** against the **current-clusters**
    - If the **current-clusters** and **previous-clusters** are same, stop the algorithm
    - Else
        - Set **previous-clusters** to **current-clusters**
        - Reset **current-clusters** for next iteration
        - Reset parameters after updating each centroid's location
        - Repeat from step 2
</details>

<details>
<summary>K Medoids</summary>
    
**Note: The final medoids may not be the optimal medoids (As every combination of data may not get evaluated)**

1. Set **Total Cost(TC)** to Infinity
2. Maintain distance matrix using Manhattan distance
3. (**Cost Evaluation**) Find cost of current combination of medoids
    - Set medoidsCost to 0
    - For each data point
        - Find closest medoid using distance matrix
        - Add that distance to medoidsCost
        - Update current-clusters
4. Check medoidsCost against TC
    - If medoidsCost >= TC, stop the algorithm
    - Else
        - Set TC equal to medoidsCost
        - Redraw
        - From each cluster, find a point whose average distance from all other points in the cluster and its medoid is the least. Use it as the cluster's new medoid
        - Repeat from step 3
</details>

<details>
<summary>DBSCAN</summary>

**Note: Stars are cores, all data points whose center lie on or inside a neighbour circle are boundary points, rest are noise**

1. Set the **epsilon (neighbourhood radius)** and the **minimum points (minPoints)**
2. For each data point that is not a core
    - Find its neighbours (N)
        - Maintain a neighbours array
        - Find Euclidean distance between current data point and every other data point
        - If distance <= epsilon, add that point as neighbour
    - If |N| + 1 >= minPoints
        - Set that data point as **core**
        - Create cluster
            - Find cores in the neighbour array
            - If a core is found, add its neighbours (which are not cores) to the neighbour array
            - Repeat and iterate till end of neighbour array
3. Redraw
</details>