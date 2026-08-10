/**
 * Curated YouTube track for MAS291 — Statistics and Probability.
 * Every id verified live+embeddable via YouTube oEmbed.
 *   node scripts/verify-youtube-videos.mjs --file ./content/course-videos/statistics-and-probability.mjs
 */
export default {
  courseSlug: 'statistics-and-probability',
  defaultVideoTrack: 'YT',
  lessons: {
    // 0.1 About & course map — a general "learn statistics" overview
    "mas291-gioi-thieu": { yt: "kyjlxsLW1Is", credit: "zedstatistics — Teach me STATISTICS in half an hour! Seriously." },
    // 1.1 Populations, samples, parameters
    "mas291-tong-the-mau": { yt: "vikkiwjQqfU", credit: "StatQuest with Josh Starmer — Population and Estimated Parameters, Clearly Explained!!!" },
    // 2.2 Conditional probability & Bayes
    "mas291-bayes": { yt: "9wCnvr7Xw4E", credit: "StatQuest with Josh Starmer — Bayes' Theorem, Clearly Explained!!!!" },
    // 3.1 Binomial distribution (mean/variance, binomial & Poisson group)
    "mas291-phan-phoi-roi-rac": { yt: "J8jNoF-K8E8", credit: "StatQuest with Josh Starmer — The Binomial Distribution and Test, Clearly Explained!!!" },
    // 3.2 Other discrete distributions (hypergeometric, geometric, negative binomial)
    "mas291-phan-phoi-roi-rac-khac": { yt: "UrOXRvG9oYE", credit: "jbstatistics — Overview of Some Discrete Probability Distributions (Binomial,Geometric,Hypergeometric,Poisson,NegB)" },
    // 4.1 Normal distribution & z-scores
    "mas291-phan-phoi-chuan": { yt: "rzFX5NWojp0", credit: "StatQuest with Josh Starmer — The Normal Distribution, Clearly Explained!!!" },
    // 4.2 PDF, CDF, continuous uniform & exponential
    "mas291-pdf-cdf-deu-mu": { yt: "OWSOhpS00_s", credit: "jbstatistics — An Introduction to Continuous Probability Distributions" },
    // 6.1 Standard error, CLT & z for x-bar
    "mas291-clt": { yt: "YAlJCEDH2uY", credit: "StatQuest with Josh Starmer — The Central Limit Theorem, Clearly Explained!!!" },
    // 7.1 Confidence intervals
    "mas291-khoang-tin-cay": { yt: "TqOeMYtOc1w", credit: "StatQuest with Josh Starmer — Confidence Intervals, Clearly Explained!!!" },
    // 8.1 Hypothesis testing procedure
    "mas291-kiem-dinh-gia-thuyet": { yt: "0oc49DyA3hU", credit: "StatQuest with Josh Starmer — Hypothesis Testing and The Null Hypothesis, Clearly Explained!!!" },
    // 9.1 Difference of two means
    "mas291-hai-trung-binh": { yt: "UcZwyzwWU7o", credit: "The Organic Chemistry Tutor — Hypothesis Testing - Difference of Two Means - Student's -Distribution & Normal Distribution" },
    // 10.1 Correlation r, regression line & R^2
    "mas291-hoi-quy": { yt: "nk2CQITm_eo", credit: "StatQuest with Josh Starmer — Linear Regression, Clearly Explained!!!" },
    // 10.2 Inference on the regression model (ANOVA, t-tests)
    "mas291-suy-luan-hoi-quy": { yt: "NF5_btOaCig", credit: "StatQuest with Josh Starmer — Using Linear Models for t-tests and ANOVA, Clearly Explained!!!" },
    // R.2 Counting: permutations & combinations
    "mas291-dem-phan-phoi-mo-rong": { yt: "XJnIdRXUi7A", credit: "The Organic Chemistry Tutor — Permutations and Combinations Tutorial" },
  },
};
