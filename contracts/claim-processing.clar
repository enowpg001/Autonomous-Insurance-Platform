;; Claim Processing Contract

(define-data-var claim-counter uint u0)

(define-map claims
  { claim-id: uint }
  {
    policy-id: uint,
    claimant: principal,
    amount: uint,
    description: (string-utf8 500),
    status: (string-ascii 20),
    verdict: (optional bool)
  }
)

(define-constant err-invalid-claim (err u404))

(define-public (file-claim (policy-id uint) (amount uint) (description (string-utf8 500)))
  (let
    (
      (claim-id (+ (var-get claim-counter) u1))
    )
    (map-set claims
      { claim-id: claim-id }
      {
        policy-id: policy-id,
        claimant: tx-sender,
        amount: amount,
        description: description,
        status: "pending",
        verdict: none
      }
    )
    (var-set claim-counter claim-id)
    (ok claim-id)
  )
)

(define-public (process-claim (claim-id uint) (approved bool))
  (let
    (
      (claim (unwrap! (map-get? claims { claim-id: claim-id }) err-invalid-claim))
    )
    (ok (map-set claims
      { claim-id: claim-id }
      (merge claim {
        status: (if approved "approved" "rejected"),
        verdict: (some approved)
      })
    ))
  )
)

(define-read-only (get-claim (claim-id uint))
  (ok (unwrap! (map-get? claims { claim-id: claim-id }) err-invalid-claim))
)

