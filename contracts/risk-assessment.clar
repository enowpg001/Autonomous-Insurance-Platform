;; Risk Assessment Contract

(define-map risk-scores
  { coverage-type: (string-ascii 20), risk-factor: (string-ascii 20) }
  { score: uint }
)

(define-constant err-unauthorized (err u403))

(define-public (set-risk-score (coverage-type (string-ascii 20)) (risk-factor (string-ascii 20)) (score uint))
  (begin
    (asserts! (is-eq tx-sender contract-caller) err-unauthorized)
    (ok (map-set risk-scores
      { coverage-type: coverage-type, risk-factor: risk-factor }
      { score: score }
    ))
  )
)

(define-read-only (get-risk-score (coverage-type (string-ascii 20)) (risk-factor (string-ascii 20)))
  (default-to u50 (get score (map-get? risk-scores { coverage-type: coverage-type, risk-factor: risk-factor })))
)

(define-read-only (calculate-premium (coverage-type (string-ascii 20)) (coverage-amount uint) (risk-factors (list 5 (string-ascii 20))))
  (let
    (
      (base-rate u100) ;; 1% in basis points
      (risk-score (fold + (map get-risk-score (list coverage-type coverage-type coverage-type coverage-type coverage-type) risk-factors) u0))
    )
    (ok (/ (* coverage-amount (+ base-rate risk-score)) u10000))
  )
)

