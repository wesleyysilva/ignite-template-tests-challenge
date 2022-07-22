module.exports = {
  coverageProvider: "v8",

  collectCoverage: true,
  collectCoverageFrom: ["<rootDir>/src/modules/**/useCases/**/*.ts"],
  coverageDirectory: "coverage",
  coverageReporters: ["text-summary", "lcov"],

  preset: "ts-jest",

};