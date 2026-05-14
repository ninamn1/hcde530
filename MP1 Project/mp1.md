# Mini Project 1 — Competency Claims

## C5 — Data Analysis with pandas
I used pandas to answer three analytical questions about the top 100 anime, including grouping titles by decade of release using `pd.cut` with custom bins and computing average user scores per period. The biggest challenge was handling missing data — 31 out of 100 anime had no release year listed, so I had to investigate which titles were affected and decide how to account for them by creating an "Unknown" group rather than silently dropping nearly a third of the dataset.

## C6 — Data Visualization
I initially considered a pie chart to visualize average scores by decade, but realized the scores were so close together (8.72–8.82) that every slice would look nearly identical, making the comparison meaningless. I switched to a horizontal bar chart with a narrowed x-axis, clear decade labels, and title counts annotated on each bar, which made the small but meaningful score differences easy to see at a glance.

## C7 — Critical Evaluation and Professional Judgment
When the decade analysis only accounted for 69 out of 100 anime, I investigated and found that 31 titles had no release year in the dataset, then added an "Unknown" group so the results transparently showed what was missing rather than hiding it. I also recognized that small sample sizes within certain decades (e.g., the 1980s with only 1 title) make those averages unreliable, which limits how confidently conclusions can be drawn from the comparison.
