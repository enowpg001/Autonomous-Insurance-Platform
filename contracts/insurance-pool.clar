;; Insurance Pool Contract

(define-fungible-token pool-token)

(define-data-var total-staked uint u0)

(define-map stakers principal uint)

(define-constant err-insufficient-funds (err u401))

(define-public (stake (amount uint))
  (let
    (
      (balance (stx-get-balance tx-sender))
    )
    (asserts! (>= balance amount) err-insufficient-funds)
    (try! (stx-transfer? amount tx-sender (as-contract tx-sender)))
    (try! (ft-mint? pool-token amount tx-sender))
    (map-set stakers tx-sender (+ (default-to u0 (map-get? stakers tx-sender)) amount))
    (var-set total-staked (+ (var-get total-staked) amount))
    (ok amount)
  )
)

(define-public (unstake (amount uint))
  (let
    (
      (staked-amount (default-to u0 (map-get? stakers tx-sender)))
    )
    (asserts! (>= staked-amount amount) err-insufficient-funds)
    (try! (ft-burn? pool-token amount tx-sender))
    (try! (as-contract (stx-transfer? amount tx-sender tx-sender)))
    (map-set stakers tx-sender (- staked-amount amount))
    (var-set total-staked (- (var-get total-staked) amount))
    (ok amount)
  )
)

(define-read-only (get-staked-amount (staker principal))
  (ok (default-to u0 (map-get? stakers staker)))
)

(define-read-only (get-total-staked)
  (ok (var-get total-staked))
)

