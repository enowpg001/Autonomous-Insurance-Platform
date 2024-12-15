;; Insurance Policy Contract

(define-data-var policy-counter uint u0)

(define-map policies
  { policy-id: uint }
  {
    owner: principal,
    coverage-type: (string-ascii 20),
    coverage-amount: uint,
    premium: uint,
    start-date: uint,
    end-date: uint,
    is-active: bool
  }
)

(define-constant err-unauthorized (err u403))
(define-constant err-invalid-policy (err u404))

(define-public (create-policy (coverage-type (string-ascii 20)) (coverage-amount uint) (premium uint) (duration uint))
  (let
    (
      (policy-id (+ (var-get policy-counter) u1))
      (start-date block-height)
      (end-date (+ start-date duration))
    )
    (map-set policies
      { policy-id: policy-id }
      {
        owner: tx-sender,
        coverage-type: coverage-type,
        coverage-amount: coverage-amount,
        premium: premium,
        start-date: start-date,
        end-date: end-date,
        is-active: true
      }
    )
    (var-set policy-counter policy-id)
    (ok policy-id)
  )
)

(define-read-only (get-policy (policy-id uint))
  (ok (unwrap! (map-get? policies { policy-id: policy-id }) err-invalid-policy))
)

(define-public (cancel-policy (policy-id uint))
  (let
    (
      (policy (unwrap! (map-get? policies { policy-id: policy-id }) err-invalid-policy))
    )
    (asserts! (is-eq (get owner policy) tx-sender) err-unauthorized)
    (ok (map-set policies
      { policy-id: policy-id }
      (merge policy { is-active: false })
    ))
  )
)

